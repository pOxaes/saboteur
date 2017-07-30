const gamesService = require("./games");
const boardRules = require("saboteur-shared/board");
const gameRules = require("saboteur-shared/game");
const saboteurService = require("./saboteur");
const clone = require("clone");

const playCardOnPlayer = (card, player) => {
  if (card.action === "BLOCK") {
    player.malus = card.subtype;
  } else if (card.action === "FREE") {
    player.malus = [];
  }
};

const playCardOnSlot = (card, { x, y }, board, userId) => {
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
    return board;
  } else if (card.action === "REVEAL") {
    const slot = board.find(slot => slot.x === x && slot.y === y);
    slot.allowedUsers.push({
      id: userId,
      date: new Date().getTime()
    });
    return board;
  }
};

const endRound = (winningPlayer, game) => {
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
};

const playCard = (userId, gameId, cardId, isRotated, destination) => {
  const game = gamesService.getById(gameId);

  let board;
  let slots;

  // - check if user can play
  if (userId !== game.currentPlayerId) {
    return Promise.reject("not your playing turn");
  }

  // - check if user has card
  const player = game.players.find(player => player.id === userId);
  const playedCard = clone(player.cards.find(card => card.id === cardId));
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
  let canPlayCardOnDestination = false;

  if (destination.type === "DISCARD") {
    canPlayCardOnDestination = true;
  } else if (destination.type === "PLAYER") {
    const destPlayer = game.players.find(
      player => player.id === destination.id
    );
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
    const slot = slots.find(
      slot => slot.x === destination.x && slot.y === destination.y
    );
    canPlayCardOnDestination = boardRules.canPlayCardOnSlot(playedCard, slot);

    if (canPlayCardOnDestination) {
      // - add card to board
      game.board = playCardOnSlot(playedCard, slot, game.board, userId);
    }

    // check if path to hidden cards is opened
    if (destination.type === "SLOT") {
      const hiddenSiblings = boardRules
        .getLinkedSiblings(board, destination)
        .filter(sibling => sibling.hidden);

      hiddenSiblings.forEach(({ x, y }) => {
        game.board.find(slot => slot.x === x && slot.y === y).hidden = false;
      });

      // - gold has been discovered
      const goldDiscovered = hiddenSiblings.some(
        sibling => sibling.item === "GOLD"
      );
      if (goldDiscovered) {
        endRound(player, game);
        return;
      }
    }
  }

  if (!canPlayCardOnDestination) {
    return Promise.reject("you cannot perform this move pal");
  }

  // - remove card from hand
  player.cards = player.cards.filter(card => card.id !== cardId);

  // game is finished if:
  // - no more cards per player & deck
  const noMoreMove =
    game.deck.length === 0 &&
    game.players.every(player => player.cards.length === 0);

  if (noMoreMove) {
    endRound({ role: "DESTROYER" }, game);
    return;
  }

  // - make him draw a card
  if (game.deck.length > 0) {
    player.cards.push(game.deck[0]);
    game.deck.shift();
  }

  // - check who is next player
  const playerIndex = game.players.map(player => player.id).indexOf(userId);
  const nextPlayerIndex = (playerIndex + 1) % game.players.length;
  game.currentPlayerId = game.players[nextPlayerIndex].id;
  return "lol";
};

module.exports = {
  playCard
};
