const uuid = require("node-uuid");
const gameRules = require("saboteur-shared/game");
const boardRules = require("saboteur-shared/board");
const userService = require("./user");
const saboteurService = require("./saboteur");
const utils = require("./utils");
const clone = require("clone");

const games = {};

// TODO: remove me

games["0ef7d117-14ec-43ce-bd0f-7332fe606341"] = {
  name: "My Lobby Game",
  maxPlayers: 7,
  id: "0ef7d117-14ec-43ce-bd0f-7332fe606341",
  status: "WAITING_FOR_PLAYERS",
  creator: "0ef7d117-14ec-43ce-bd0f-7332fe606340",
  creationDate: new Date(),
  players: [
    { id: "0ef7d117-14ec-43ce-bd0f-7332fe606340" },
    { id: "1f96f823-3c62-4024-bc74-1396ce43103e" }
  ]
};

games["0ef7d117-14ec-43ce-bd0f-7332fe606342"] = {
  name: "My Playing Game",
  maxPlayers: 7,
  id: "0ef7d117-14ec-43ce-bd0f-7332fe606342",
  status: "PLAYING",
  creator: "0ef7d117-14ec-43ce-bd0f-7332fe606340",
  creationDate: "2017-07-29T21:08:25.718Z",
  players: [
    {
      id: "0ef7d117-14ec-43ce-bd0f-7332fe606340",
      malus: [],
      cards: [
        {
          type: "PATH",
          layout: "0110",
          item: "EMPTY",
          id: 27
        },
        {
          type: "ACTION",
          action: "BLOCK",
          subtype: ["CHARIOT"],
          id: 47
        },
        {
          type: "PATH",
          layout: "1100",
          item: "EMPTY",
          id: 22
        },
        {
          type: "ACTION",
          action: "REVEAL",
          id: 60
        },
        {
          type: "PATH",
          layout: "0101",
          item: "EMPTY",
          id: 14
        },
        {
          type: "PATH",
          layout: "1100",
          item: "EMPTY",
          id: 20
        }
      ],
      gold: [],
      role: "BUILDER"
    },
    {
      id: "1f96f823-3c62-4024-bc74-1396ce43103e",
      malus: [],
      cards: [
        {
          type: "PATH",
          layout: "0101",
          item: "EMPTY",
          id: 13
        },
        {
          type: "ACTION",
          action: "FREE",
          subtype: ["LIGHT", "CHARIOT"],
          id: 52
        },
        {
          type: "ACTION",
          action: "FREE",
          subtype: ["LIGHT"],
          id: 44
        },
        {
          type: "ACTION",
          action: "DESTROY",
          id: 63
        },
        {
          type: "PATH",
          layout: "1100",
          item: "EMPTY",
          id: 23
        },
        {
          type: "PATH",
          layout: "1111",
          item: "EMPTY",
          id: 16
        }
      ],
      gold: [],
      role: "DESTROYER"
    }
  ],
  deck: [
    {
      type: "PATH",
      layout: "1110",
      item: "EMPTY",
      id: 0
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["PICKAXE"],
      id: 39
    },
    {
      type: "PATH",
      layout: "1101",
      item: "ROCK",
      id: 29
    },
    {
      type: "PATH",
      layout: "1110",
      item: "EMPTY",
      id: 1
    },
    {
      type: "PATH",
      layout: "0101",
      item: "ROCK",
      id: 31
    },
    {
      type: "ACTION",
      action: "BLOCK",
      subtype: ["LIGHT"],
      id: 43
    },
    {
      type: "PATH",
      layout: "1100",
      item: "ROCK",
      id: 33
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["LIGHT", "PICKAXE"],
      id: 53
    },
    {
      type: "PATH",
      layout: "1100",
      item: "EMPTY",
      id: 21
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["LIGHT"],
      id: 45
    },
    {
      type: "ACTION",
      action: "BLOCK",
      subtype: ["CHARIOT"],
      id: 48
    },
    {
      type: "PATH",
      layout: "0101",
      item: "EMPTY",
      id: 12
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["LIGHT"],
      id: 49
    },
    {
      type: "ACTION",
      action: "DESTROY",
      id: 61
    },
    {
      type: "ACTION",
      action: "REVEAL",
      id: 59
    },
    {
      type: "PATH",
      layout: "1010",
      item: "EMPTY",
      id: 10
    },
    {
      type: "PATH",
      layout: "1010",
      item: "EMPTY",
      id: 9
    },
    {
      type: "ACTION",
      action: "BLOCK",
      subtype: ["LIGHT"],
      id: 41
    },
    {
      type: "ACTION",
      action: "BLOCK",
      subtype: ["CHARIOT"],
      id: 46
    },
    {
      type: "PATH",
      layout: "0101",
      item: "EMPTY",
      id: 15
    },
    {
      type: "ACTION",
      action: "DESTROY",
      id: 64
    },
    {
      type: "PATH",
      layout: "0110",
      item: "ROCK",
      id: 34
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["CHARIOT", "PICKAXE"],
      id: 55
    },
    {
      type: "PATH",
      layout: "1010",
      item: "EMPTY",
      id: 11
    },
    {
      type: "PATH",
      layout: "1010",
      item: "ROCK",
      id: 30
    },
    {
      type: "ACTION",
      action: "REVEAL",
      id: 58
    },
    {
      type: "ACTION",
      action: "BLOCK",
      subtype: ["PICKAXE"],
      id: 36
    },
    {
      type: "PATH",
      layout: "1110",
      item: "EMPTY",
      id: 2
    },
    {
      type: "PATH",
      layout: "0110",
      item: "EMPTY",
      id: 25
    },
    {
      type: "PATH",
      layout: "1101",
      item: "EMPTY",
      id: 4
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["LIGHT"],
      id: 50
    },
    {
      type: "PATH",
      layout: "1110",
      item: "EMPTY",
      id: 3
    },
    {
      type: "PATH",
      layout: "0110",
      item: "EMPTY",
      id: 26
    },
    {
      type: "PATH",
      layout: "1111",
      item: "EMPTY",
      id: 18
    },
    {
      type: "ACTION",
      action: "DESTROY",
      id: 62
    },
    {
      type: "PATH",
      layout: "0110",
      item: "EMPTY",
      id: 24
    },
    {
      type: "ACTION",
      action: "BLOCK",
      subtype: ["LIGHT"],
      id: 42
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["CHARIOT", "PICKAXE"],
      id: 56
    },
    {
      type: "PATH",
      layout: "1111",
      item: "EMPTY",
      id: 17
    },
    {
      type: "ACTION",
      action: "BLOCK",
      subtype: ["PICKAXE"],
      id: 37
    },
    {
      type: "PATH",
      layout: "1111",
      item: "EMPTY",
      id: 19
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["LIGHT", "PICKAXE"],
      id: 54
    },
    {
      type: "PATH",
      layout: "1101",
      item: "EMPTY",
      id: 5
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["LIGHT", "CHARIOT"],
      id: 51
    },
    {
      type: "PATH",
      layout: "1111",
      item: "ROCK",
      id: 32
    },
    {
      type: "ACTION",
      action: "REVEAL",
      id: 57
    },
    {
      type: "PATH",
      layout: "1010",
      item: "EMPTY",
      id: 8
    },
    {
      type: "PATH",
      layout: "1110",
      item: "ROCK",
      id: 28
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["PICKAXE"],
      id: 40
    },
    {
      type: "ACTION",
      action: "BLOCK",
      subtype: ["PICKAXE"],
      id: 35
    },
    {
      type: "PATH",
      layout: "1101",
      item: "EMPTY",
      id: 7
    },
    {
      type: "PATH",
      layout: "1101",
      item: "EMPTY",
      id: 6
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["PICKAXE"],
      id: 38
    }
  ],
  currentPlayerId: "0ef7d117-14ec-43ce-bd0f-7332fe606340",
  board: [
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
      item: "EMPTY"
    },
    {
      x: 8,
      y: -2,
      hidden: true,
      layout: "1011",
      item: "GOLD"
    },
    {
      x: 0,
      y: 0,
      layout: "1111",
      item: "LADDER"
    },
    {
      x: 1,
      y: 0,
      layout: "1111",
      item: "EMPTY"
    },
    {
      x: 2,
      y: 0,
      layout: "1111",
      item: "EMPTY"
    },
    {
      x: 3,
      y: 0,
      layout: "1111",
      item: "EMPTY"
    },
    {
      x: 4,
      y: 0,
      layout: "1111",
      item: "EMPTY"
    },
    {
      x: 5,
      y: 0,
      layout: "1111",
      item: "EMPTY"
    },
    {
      x: 6,
      y: 0,
      layout: "1111",
      item: "EMPTY"
    }
  ]
};

const STATUSES = {
  WAITING_FOR_PLAYERS: "WAITING_FOR_PLAYERS",
  PLAYING: "PLAYING",
  COMPLETED: "COMPLETED"
};

const getForUser = userId => {
  return Object.values(games).filter(
    game =>
      game.status === STATUSES.WAITING_FOR_PLAYERS ||
      game.players.some(player => player.id === userId)
  );
};

const insert = (game, userId) => {
  const newGame = Object.assign({}, game, {
    id: uuid.v4(),
    status: STATUSES.WAITING_FOR_PLAYERS,
    creator: userId,
    creationDate: new Date(),
    players: [
      {
        id: userId
      }
    ]
  });
  games[newGame.id] = newGame;
  return newGame;
};

const getById = id => games[id];

const removeSecretData = (game, userId) => {
  if (game.status === STATUSES.PLAYING) {
    game.deck = game.deck.length;
    game.board.forEach(card => {
      if (card.hidden) {
        delete card.layout;
        delete card.item;
      }
    });
    game.players.forEach(player => {
      if (player.id !== userId) {
        delete player.role;
        player.cards = player.cards.map(card => ({
          type: "HIDDEN"
        }));
      }
    });
  }
};

const attachAuth = (game, userId) => {
  const isCreator = userId === game.creator;
  return Object.assign({}, game, {
    _canKick: canKick(game, userId),
    _canDelete: isCreator,
    _hasJoined: containsPlayer(game, userId),
    _canStart: canStart(game, userId)
  });
};

const format = (game, userId) => {
  game = clone(game);
  removeSecretData(game, userId);
  return attachAuth(game, userId);
};

const withUsers = (game, usersDictionnary) => {
  game.players.forEach(player => {
    player.name = usersDictionnary[player.id].name;
    player.avatarUrl = usersDictionnary[player.id].avatarUrl;
  });
  return game;
};

const remove = gameId => {
  delete games[gameId];
};

const removePlayer = (gameId, playerId) => {
  const game = getById(gameId);
  game.players = game.players.filter(player => player.id !== playerId);
  if (game.players.length === 0) {
    remove(gameId);
    return;
  }
  if (game.creator === playerId) {
    game.creator = game.players[0].id;
  }
};

const containsPlayer = (game, playerId) => {
  return game.players.some(player => player.id === playerId);
};

const addPlayer = (game, playerId) => {
  game.players.push({
    id: playerId
  });
};

const canKick = (game, userId, kickedPlayerId) =>
  game.creator === userId &&
  game.status === STATUSES.WAITING_FOR_PLAYERS &&
  (typeof kickedPlayerId === "undefined" ||
    containsPlayer(game, kickedPlayerId));

const canStart = (game, userId) =>
  game.creator === userId &&
  game.status === STATUSES.WAITING_FOR_PLAYERS &&
  game.players.length >= gameRules.MIN_PLAYERS_COUNT;

const start = game => {
  game.status = STATUSES.PLAYING;
  Object.assign(game, {
    status: STATUSES.PLAYING,
    deck: saboteurService.buildDeck(),
    currentPlayerId: utils.randomPick(game.players).id, // TODO: random please
    board: saboteurService.computeInitialBoard(),
    players: saboteurService.distributeRoles(
      game.players.map(saboteurService.formatPlayer)
    )
  });
  saboteurService.distributeCards(game);
  return game;
};

const playCardOnPlayer = (card, player) => {
  if (card.action === "BLOCK") {
    player.malus = card.subtype;
  } else if (card.action === "FREE") {
    player.malus = [];
  }
};

const playCardOnSlot = (card, { x, y }, board) => {
  if (card.action === "DESTROY") {
    board = board.filter(slot => slot.x !== x || slot.y !== y);
  } else if (card.type === "PATH") {
    const newSlot = {
      x,
      y,
      layout: boardRules.formatLayoutToString(card.layout),
      item: card.item
    };
    board.push(newSlot);
  }
};

const playCard = (userId, gameId, cardId, isRotated, destination) => {
  // TODO: HANDLE DESTRUCTION CARD (not workint);
  // TODO: HANDLE DISCARD;

  const game = getById(gameId);

  let board;
  let slots;

  // - check if user can play
  if (userId !== game.currentPlayerId) {
    console.log("not your playing turn");
    return;
  }

  // - check if user has card
  const player = game.players.find(player => player.id === userId);
  const playedCard = clone(player.cards.find(card => card.id === cardId));
  if (!playedCard) {
    console.log("wrong card played");
    return;
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

  if (destination.type === "PLAYER") {
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
    // TODO: on map play, reveal card
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
      playCardOnSlot(playedCard, slot, game.board);
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
        console.log("Builders won");
        // TODO: on game finish, reveal roles and distribute gold
        return;
      }
    }
  }

  if (!canPlayCardOnDestination) {
    // TODO: reject with error
    console.log("you cannot perform this move pal");
    return;
  }

  // - remove card from hand
  player.cards = player.cards.filter(card => card.id !== cardId);

  // - check if game is finished
  // TODO: check game end
  // game is finished if:

  // - no more cards per player & deck
  const noMoreMove =
    game.deck.length === 0 &&
    game.players.every(player => player.cards.length === 0);

  if (noMoreMove) {
    console.log("Destroyers won");
    // TODO: on game finish, reveal roles and distribute gold
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

  // console.log("playerCard");
  // console.log("userId", userId);
  // console.log("gameId", gameId);
  // console.log("cardId", cardId);
  // console.log("isRotated", isRotated);
  // console.log("destination", destination);
  return "lol";
};

module.exports = {
  STATUSES,
  addPlayer,
  canKick,
  canStart,
  format,
  getForUser,
  getById,
  insert,
  playCard,
  removePlayer,
  containsPlayer,
  remove,
  start,
  withUsers
};