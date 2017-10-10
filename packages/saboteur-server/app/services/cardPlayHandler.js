const clone = require("clone");
const boardRules = require("saboteur-shared/src/board");
const gameRules = require("saboteur-shared/src/game");
const events = require("saboteur-shared/src/events");
const { randomPick } = require("saboteur-shared/src/utils");
const gamesService = require("./games");
const messageService = require("./message");
const wsService = require("./ws");
const saboteurService = require("./saboteur");

function addPlayedMessage({ game, player, card, destination }) {
  gamesService.createMessage(
    game,
    messageService.compute({ player, card, destination })
  );
}

function playCardOnPlayer(card, player) {
  if (card.action === "BLOCK") {
    player.malus = card.subtype;
  } else if (card.action === "FREE") {
    player.malus = [];
  }
}

function playCardOnSlot(card, { x, y }, board, userId) {
  if (card.action === "DESTROY") {
    return board.filter(slot => slot.x !== x || slot.y !== y);
  } else if (card.type === "PATH") {
    const newSlot = {
      x,
      y,
      layout: boardRules.formatLayoutToString(card.layout),
      item: card.item
    };
    board.push(newSlot);
  }
  return board;
}

function endRound(winningPlayer, game) {
  saboteurService.distributeGold(winningPlayer, game.players);
  game.status =
    game.currentRound === saboteurService.MAX_ROUNDS
      ? gameRules.STATUSES.COMPLETED
      : gameRules.STATUSES.ROUND_END;

  game.winningPlayer = winningPlayer;
  game.players.forEach(player => {
    delete player.malus;
    delete player.cards;
  });

  delete game.currentPlayerId;
  delete game.board;
  delete game.deck;
  // gamesService.triggerForPlayersWithAuth(game, events.ROUND_END);
}

async function playCard(userId, gameId, cardId, isRotated, destination) {
  const game = gamesService.getById(gameId);
  if (!game) {
    return Promise.reject("this game does not exists");
  }

  let board;
  let slots;

  // - check if user can play
  if (userId !== game.currentPlayerId) {
    return Promise.reject("not your playing turn");
  }

  // - check if user has card
  const playingUser = game.players.find(player => player.id === userId);
  const playedCard = clone(playingUser.cards.find(card => card.id === cardId));
  if (!playedCard) {
    return Promise.reject("wrong card played");
  }

  // if card has layout, format it and rotate if needed
  if (playedCard.layout) {
    boardRules.formatCardLayout(playedCard);

    if (isRotated) {
      boardRules.rotateCardLayout(playedCard);
    }
  }

  // - check if user can play card on destination
  let goldDiscovered = false;
  let canPlayCardOnDestination = false;
  let slot;
  let finalDestination = destination;

  if (destination.type === "DISCARD") {
    canPlayCardOnDestination = true;
  } else if (destination.type === "PLAYER") {
    const destPlayer = game.players.find(
      player => player.id === destination.id
    );

    finalDestination = destPlayer;

    canPlayCardOnDestination = boardRules.canPlayCardOnPlayer(
      playedCard,
      destPlayer
    );
    if (canPlayCardOnDestination) {
      // add / remove malus on dest player
      playCardOnPlayer(playedCard, destPlayer);
    }
  } else if (destination.type === "SLOT") {
    board = clone(game.board);
    board.forEach(boardRules.formatCardLayout);
    board.forEach(boardRules.attachLinkedToStart);
    slots = boardRules.createSlotsFromCards(board);
    slot = slots.find(
      slot => slot.x === destination.x && slot.y === destination.y
    );
    finalDestination = slot;
    canPlayCardOnDestination = boardRules.canPlayCardOnSlot(
      playedCard,
      slot,
      playingUser
    );

    if (canPlayCardOnDestination) {
      // - add card to board
      game.board = playCardOnSlot(playedCard, slot, game.board, userId);
    }

    const destSlotWithCard = {
      x: destination.x,
      y: destination.y,
      layout: playedCard.layout
    };

    // check if path to hidden cards is opened
    const hiddenSiblings = boardRules
      .getLinkedSiblings(board, destSlotWithCard)
      .filter(sibling => sibling.hidden);

    hiddenSiblings.forEach(({ x, y }) => {
      game.board.find(slot => slot.x === x && slot.y === y).hidden = false;
    });

    // - gold has been discovered
    const goldSibling = hiddenSiblings.find(sibling => sibling.item === "GOLD");

    goldDiscovered =
      goldSibling &&
      playedCard.item !== "ROCK" &&
      boardRules.isPathOpen(goldSibling, destSlotWithCard);
  }

  if (!canPlayCardOnDestination) {
    return Promise.reject("you cannot perform this move pal");
  }

  addPlayedMessage({
    game,
    player: playingUser,
    card: playedCard,
    destination: finalDestination
  });

  gamesService.triggerForPlayers(game, events.PLAY_CARD, {
    playedCard,
    playerId: userId,
    destination
  });

  if (destination.type === "SLOT") {
    boardRules
      .getLinkedSiblings(board, destination)
      .filter(card => card.hidden)
      .forEach(card => {
        gamesService.triggerForPlayers(
          game,
          events.REVEAL_CARD_PERMANENTLY,
          card
        );
      });
  }

  if (playedCard.action === "REVEAL" && destination.type === "SLOT") {
    wsService.trigger(
      events.REVEAL_CARD,
      {
        gameId: game.id,
        slot
      },
      [userId]
    );
  }

  if (goldDiscovered) {
    let winningPlayer = playingUser;
    if (playingUser.role === gameRules.ROLES.SABOTEUR) {
      winningPlayer = randomPick(
        game.players.filter(player => player.role === gameRules.ROLES.BUILDER)
      );
      gamesService.createMessage(
        game,
        `${playingUser.name} discovered the gold... but he is a native and he made ${winningPlayer.name} the explorer win this round!`
      );
    } else {
      gamesService.createMessage(
        game,
        `${playingUser.name} discovered the gold and won this round!`
      );
    }
    endRound(winningPlayer, game);
    return;
  }

  // - remove card from hand
  playingUser.cards = playingUser.cards.filter(card => card.id !== cardId);

  // game is finished if:
  // - no more cards per player & deck
  const noMoreMove =
    game.deck.length === 0 &&
    game.players.every(player => player.cards.length === 0);

  if (noMoreMove) {
    gamesService.createMessage(
      game,
      "Explorers did not succeed to find gold and natives won the round."
    );
    endRound({ role: gameRules.ROLES.SABOTEUR }, game);
    return;
  }

  // - make him draw a card
  if (game.deck.length > 0) {
    const drawnCard = game.deck[0];
    playingUser.cards.push(drawnCard);
    game.deck.shift();
    game.players.forEach(player => {
      const isCurrentPlayer = player.id === userId;
      wsService.trigger(
        events.DRAW_CARD,
        {
          gameId: game.id,
          card: isCurrentPlayer ? drawnCard : { type: "HIDDEN" },
          playerId: userId,
          deck: game.deck.length
        },
        [player.id]
      );
    });
  }

  // - check who is next player
  const playerIndex = game.players.map(player => player.id).indexOf(userId);
  const nextPlayerIndex = (playerIndex + 1) % game.players.length;
  game.currentPlayerId = game.players[nextPlayerIndex].id;
  gamesService.triggerForPlayers(game, events.CURRENT_PLAYER_UPDATE, {
    currentPlayerId: game.players[nextPlayerIndex].id
  });
}

module.exports = {
  playCard
};
