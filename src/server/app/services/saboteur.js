const utils = require("./utils");
const deck = require("./deck");

const INITIAL_DECK_COUNT = 30;

const MIN_PLAYERS_COUNT = 2;

const ROLES = {
  BUILDER: "BUILDER",
  DESTROYER: "DESTROYER"
};

// 44 path cards (40 distribuables, 4 sur le board)

const stackItemToCard = stack => {
  if (stack.layout) {
    // TODO: randomly rotate layout
    return {
      type: "PATH",
      layout: stack.layout,
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
    return index < destroyersCount ? ROLES.DESTROYER : ROLES.BUILDER;
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
    gold: [],
    role: ROLES.BUILDER
  });

const computeInitialBoard = () => {
  const cards = [
    {
      x: 8,
      y: 0,
      hidden: true,
      layout: "1011",
      item: "EMPTY"
    },
    {
      x: 8,
      y: 2,
      hidden: true,
      layout: "1010",
      item: "ROCK"
    },
    {
      x: 8,
      y: -2,
      hidden: true,
      layout: "1011",
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

module.exports = {
  INITIAL_DECK_COUNT,
  MIN_PLAYERS_COUNT,
  buildDeck,
  computeInitialBoard,
  distributeCards,
  distributeRoles,
  formatPlayer
};
