const utils = require("saboteur-shared/src/utils");
const gameRules = require("saboteur-shared/src/game");
const boardRules = require("saboteur-shared/src/board");
const deck = require("./deck");

const MAX_ROUNDS = 3;

// 44 path cards (40 distribuables, 4 sur le board)

const stackItemToCard = stack => {
  if (stack.layout) {
    return {
      type: "PATH",
      layout: utils.randomPick([true, false])
        ? boardRules.rotateStringLayout(stack.layout)
        : stack.layout,
      item: stack.item || "EMPTY"
    };
  } else if (stack.subtype) {
    return {
      type: "ACTION",
      action: stack.action,
      subtype: stack.subtype
    };
  }
  return {
    type: "ACTION",
    action: stack.action
  };
};

const buildDeck = () => {
  const computedDeck = deck.reduce((acc, stack) => {
    for (let i = 0; i < stack.count; i++) {
      acc.push(stackItemToCard(stack));
    }
    return acc;
  }, []);
  computedDeck.forEach((card, index) => {
    card.id = index;
  });
  return utils.shuffle(computedDeck);
};

const distributeCards = ({ players, deck, currentPlayerId }) => {
  const playersCount = players.length;

  // 3 to 5 players: 6 cards
  // 6 to 7 players: 5 cards
  // 8 to 10 players: 4 cards
  let cardsPerPlayer = 4;
  if (playersCount <= 5) {
    cardsPerPlayer = 6;
  } else if (playersCount <= 7) {
    cardsPerPlayer = 5;
  }

  const firstPlayerIndex = players
    .map(player => player.id)
    .indexOf(currentPlayerId);

  for (
    let i = firstPlayerIndex, len = firstPlayerIndex + playersCount;
    i < len;
    i++
  ) {
    const playerIndex = i % playersCount;
    players[playerIndex].cards = [];
    for (let j = 0; j < cardsPerPlayer; j++) {
      let cardIndex = i - firstPlayerIndex + playersCount * j;
      players[playerIndex].cards.push(deck[cardIndex]);
    }
  }

  const cardToRemoveFromDeck = playersCount * cardsPerPlayer;
  deck.splice(0, cardToRemoveFromDeck);
};

const distributeRoles = players => {
  let destroyersCount;

  // 3 to 4 players, 1 destroyer
  // 5 to 6 players, 2 destroyer
  // 7 to 9 players, 3 destroyer
  // 10 players, 4 destroyer
  if (players.length <= 4) {
    destroyersCount = 1;
  } else if (players.length <= 6) {
    destroyersCount = 2;
  } else if (players.length <= 9) {
    destroyersCount = 3;
  } else {
    destroyersCount = 4;
  }
  const rolesToDispatch = players.map((player, index) => {
    return index < destroyersCount
      ? gameRules.ROLES.SABOTEUR
      : gameRules.ROLES.BUILDER;
  });

  utils
    .shuffle(rolesToDispatch)
    .forEach((role, index) => (players[index].role = role));

  return players;
};

const formatPlayer = player =>
  Object.assign({}, player, {
    malus: [],
    cards: [],
    gold: player.gold || []
  });

const computeInitialBoard = () => {
  const cards = [
    {
      hidden: true,
      layout: "1111",
      item: "EMPTY"
    },
    {
      hidden: true,
      layout: "1111",
      item: "EMPTY"
    },
    {
      hidden: true,
      layout: "1111",
      item: "GOLD"
    }
  ];

  const coords = [
    {
      x: 8,
      y: 0
    },
    {
      x: 8,
      y: 2
    },
    {
      x: 8,
      y: -2
    }
  ];

  utils.shuffle(coords);

  return coords
    .map((coord, index) => Object.assign(coord, cards[index]))
    .concat([
      {
        x: 0,
        y: 0,
        layout: "1111",
        item: "LADDER"
      }
    ]);
};

const replaceLastGold = (player, goldValue) => {
  player.gold[player.gold.length - 1] = goldValue;
};

const distributeGold = (winningPlayer, players) => {
  const sameRolePlayers = players.filter(
    player => player.role === winningPlayer.role
  );

  players.forEach(player => player.gold.push(0));

  if (winningPlayer.role === gameRules.ROLES.SABOTEUR) {
    // If there was only 1 saboteur, he gets gold nugget cards from
    // the deck worth a total of four nuggets.
    // If there were 2 or 3 saboteurs, they each get 3 nuggets worth of gold.
    // If there were 4 saboteurs, each gets 2 nuggets.
    let goldValue = 2;
    if (sameRolePlayers.length === 1) {
      goldValue = 4;
    } else if (sameRolePlayers.length <= 3) {
      goldValue = 3;
    }
    sameRolePlayers.forEach(player => replaceLastGold(player, goldValue));
  } else if (winningPlayer.role === gameRules.ROLES.BUILDER) {
    // The player who played the last path card (that connected to the treasure)
    // draws a number of gold nugget cards (face down) equal to
    // the number of gold miners (e.g., 5 cards if there were 5 gold-diggers),
    // looks at them in secret, and chooses 1 card to keep.
    // Then, he passes the rest of gold nugget cards counter- clockwise to
    // the next gold miner (not saboteur!), who also chooses
    // 1 card and passes the rest—and so on until each gold miner gets 1 car
    // if builders won, draw 3 gold cards and distribute
    const winningPlayerIndex = players
      .map(player => player.id)
      .indexOf(winningPlayer.id);
    let drawnGold = [];
    for (let i = 0; i < sameRolePlayers.length + 10; i++) {
      drawnGold.push(utils.random(1, 4));
    }
    drawnGold.sort().reverse();

    while (sameRolePlayers[0].id !== winningPlayer.id) {
      const movedPlayer = sameRolePlayers.shift();
      sameRolePlayers.push(movedPlayer);
    }
    sameRolePlayers.forEach((player, index) =>
      replaceLastGold(player, drawnGold[index])
    );
  }
};

module.exports = {
  MAX_ROUNDS,
  buildDeck,
  computeInitialBoard,
  distributeCards,
  distributeGold,
  distributeRoles,
  formatPlayer
};
