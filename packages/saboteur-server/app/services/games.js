const uuid = require("node-uuid");
const clone = require("clone");
const gameRules = require("saboteur-shared/src/game");
const utils = require("saboteur-shared/src/utils");
const events = require("saboteur-shared/src/events");
const userService = require("./user");
const saboteurService = require("./saboteur");
const wsService = require("./ws");

const games = {};

games["dad6865a-5c26-4026-9146-d9dfb789af04"] = {
  name: "My Super Game",
  maxPlayers: 5,
  id: "dad6865a-5c26-4026-9146-d9dfb789af04",
  status: "PLAYING",
  creator: "47cd89f3-0742-4850-bc6b-e3061ed22170",
  creationDate: "2017-09-06T09:08:07.624Z",
  players: [
    {
      id: "47cd89f3-0742-4850-bc6b-e3061ed22170",
      malus: [],
      cards: [
        {
          type: "PATH",
          layout: "1111",
          item: "EMPTY",
          id: 0
        },
        {
          type: "PATH",
          layout: "0101",
          item: "EMPTY",
          id: 2
        },
        {
          type: "ACTION",
          action: "FREE",
          subtype: ["LIGHT"],
          id: 4
        },
        {
          type: "PATH",
          layout: "1011",
          item: "ROCK",
          id: 6
        },
        {
          type: "PATH",
          layout: "0011",
          item: "EMPTY",
          id: 8
        },
        {
          type: "ACTION",
          action: "FREE",
          subtype: ["LIGHT"],
          id: 10
        }
      ],
      gold: [],
      role: "BUILDER"
    },
    {
      id: "a0e49070-f02a-4405-bdb7-615564d9e6af",
      malus: [],
      cards: [
        {
          type: "ACTION",
          action: "BLOCK",
          subtype: ["PICKAXE"],
          id: 1
        },
        {
          type: "PATH",
          layout: "1111",
          item: "EMPTY",
          id: 3
        },
        {
          type: "ACTION",
          action: "REVEAL",
          id: 5
        },
        {
          type: "ACTION",
          action: "FREE",
          subtype: ["LIGHT"],
          id: 7
        },
        {
          type: "ACTION",
          action: "DESTROY",
          id: 9
        },
        {
          type: "PATH",
          layout: "0101",
          item: "EMPTY",
          id: 11
        }
      ],
      gold: [],
      role: "SABOTEUR"
    }
  ],
  deck: [
    {
      type: "PATH",
      layout: "0101",
      item: "ROCK",
      id: 12
    },
    {
      type: "ACTION",
      action: "BLOCK",
      subtype: ["CHARIOT"],
      id: 13
    },
    {
      type: "PATH",
      layout: "0110",
      item: "ROCK",
      id: 14
    },
    {
      type: "PATH",
      layout: "1111",
      item: "EMPTY",
      id: 15
    },
    {
      type: "ACTION",
      action: "DESTROY",
      id: 16
    },
    {
      type: "PATH",
      layout: "1001",
      item: "EMPTY",
      id: 17
    },
    {
      type: "PATH",
      layout: "1011",
      item: "EMPTY",
      id: 18
    },
    {
      type: "PATH",
      layout: "1010",
      item: "ROCK",
      id: 19
    },
    {
      type: "PATH",
      layout: "1111",
      item: "ROCK",
      id: 20
    },
    {
      type: "PATH",
      layout: "0001",
      item: "EMPTY",
      id: 21
    },
    {
      type: "PATH",
      layout: "0001",
      item: "EMPTY",
      id: 22
    },
    {
      type: "PATH",
      layout: "1011",
      item: "EMPTY",
      id: 23
    },
    {
      type: "PATH",
      layout: "0101",
      item: "EMPTY",
      id: 24
    },
    {
      type: "PATH",
      layout: "0011",
      item: "EMPTY",
      id: 25
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["CHARIOT", "PICKAXE"],
      id: 26
    },
    {
      type: "PATH",
      layout: "1110",
      item: "EMPTY",
      id: 27
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["CHARIOT"],
      id: 28
    },
    {
      type: "PATH",
      layout: "1111",
      item: "ROCK",
      id: 29
    },
    {
      type: "ACTION",
      action: "REVEAL",
      id: 30
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["LIGHT", "PICKAXE"],
      id: 31
    },
    {
      type: "PATH",
      layout: "1111",
      item: "EMPTY",
      id: 32
    },
    {
      type: "PATH",
      layout: "1010",
      item: "EMPTY",
      id: 33
    },
    {
      type: "PATH",
      layout: "0011",
      item: "EMPTY",
      id: 34
    },
    {
      type: "PATH",
      layout: "0101",
      item: "EMPTY",
      id: 35
    },
    {
      type: "PATH",
      layout: "1011",
      item: "EMPTY",
      id: 36
    },
    {
      type: "PATH",
      layout: "1101",
      item: "EMPTY",
      id: 37
    },
    {
      type: "PATH",
      layout: "1101",
      item: "EMPTY",
      id: 38
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["PICKAXE"],
      id: 39
    },
    {
      type: "ACTION",
      action: "REVEAL",
      id: 40
    },
    {
      type: "PATH",
      layout: "0100",
      item: "EMPTY",
      id: 41
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
      subtype: ["LIGHT"],
      id: 43
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["PICKAXE"],
      id: 44
    },
    {
      type: "PATH",
      layout: "1001",
      item: "EMPTY",
      id: 45
    },
    {
      type: "ACTION",
      action: "BLOCK",
      subtype: ["CHARIOT"],
      id: 46
    },
    {
      type: "PATH",
      layout: "1100",
      item: "ROCK",
      id: 47
    },
    {
      type: "ACTION",
      action: "REVEAL",
      id: 48
    },
    {
      type: "PATH",
      layout: "1100",
      item: "EMPTY",
      id: 49
    },
    {
      type: "PATH",
      layout: "0100",
      item: "EMPTY",
      id: 50
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["CHARIOT"],
      id: 51
    },
    {
      type: "PATH",
      layout: "1101",
      item: "EMPTY",
      id: 52
    },
    {
      type: "ACTION",
      action: "FREE",
      subtype: ["LIGHT", "CHARIOT"],
      id: 53
    },
    {
      type: "ACTION",
      action: "REVEAL",
      id: 54
    },
    {
      type: "PATH",
      layout: "1101",
      item: "EMPTY",
      id: 55
    },
    {
      type: "PATH",
      layout: "1010",
      item: "EMPTY",
      id: 56
    },
    {
      type: "PATH",
      layout: "1010",
      item: "EMPTY",
      id: 57
    },
    {
      type: "PATH",
      layout: "1111",
      item: "EMPTY",
      id: 58
    },
    {
      type: "ACTION",
      action: "BLOCK",
      subtype: ["CHARIOT"],
      id: 59
    },
    {
      type: "PATH",
      layout: "0110",
      item: "EMPTY",
      id: 60
    },
    {
      type: "PATH",
      layout: "1001",
      item: "EMPTY",
      id: 61
    },
    {
      type: "ACTION",
      action: "BLOCK",
      subtype: ["PICKAXE"],
      id: 62
    },
    {
      type: "ACTION",
      action: "BLOCK",
      subtype: ["PICKAXE"],
      id: 63
    },
    {
      type: "ACTION",
      action: "DESTROY",
      id: 64
    },
    {
      type: "ACTION",
      action: "BLOCK",
      subtype: ["LIGHT"],
      id: 65
    },
    {
      type: "ACTION",
      action: "BLOCK",
      subtype: ["LIGHT"],
      id: 66
    },
    {
      type: "PATH",
      layout: "1011",
      item: "EMPTY",
      id: 67
    },
    {
      type: "PATH",
      layout: "1010",
      item: "EMPTY",
      id: 68
    },
    {
      type: "PATH",
      layout: "0111",
      item: "EMPTY",
      id: 69
    },
    {
      type: "ACTION",
      action: "REVEAL",
      id: 70
    },
    {
      type: "PATH",
      layout: "0111",
      item: "ROCK",
      id: 71
    }
  ],
  currentRound: 1,
  currentPlayerId: "47cd89f3-0742-4850-bc6b-e3061ed22170",
  board: [
    {
      x: 8,
      y: 0,
      hidden: true,
      layout: "0110",
      item: "EMPTY"
    },
    {
      x: 8,
      y: -2,
      hidden: true,
      layout: "0011",
      item: "EMPTY"
    },
    {
      x: 8,
      y: 2,
      hidden: true,
      layout: "1111",
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
      layout: "1111"
    },
    {
      x: 2,
      y: 0,
      layout: "1111"
    },
    {
      x: 3,
      y: 0,
      layout: "1111"
    },
    {
      x: 4,
      y: 0,
      layout: "1111"
    },
    {
      x: 5,
      y: 0,
      layout: "1111"
    },
    {
      x: 6,
      y: 0,
      layout: "1111"
    },
    {
      x: 6,
      y: 1,
      layout: "1111"
    },
    {
      x: 6,
      y: 2,
      layout: "1111"
    },
    {
      x: 6,
      y: -1,
      layout: "1111"
    },
    {
      x: 6,
      y: -5,
      layout: "1111"
    }
  ]
};

const triggerForPlayers = (game, event, payload) =>
  wsService.trigger(
    event,
    Object.assign({ gameId: game.id }, payload),
    game.players.map(player => player.id)
  );

const getForUser = userId => {
  return Object.values(games).filter(
    game =>
      game.status === gameRules.STATUSES.WAITING_FOR_PLAYERS ||
      game.players.some(player => player.id === userId)
  );
};

const insert = async (game, userId) => {
  const maxPlayers = parseInt(game.maxPlayers, 10);
  const name = game.name.substring(0, 50);

  const isMaxPlayersValid =
    typeof maxPlayers === "number" &&
    maxPlayers >= gameRules.MIN_PLAYERS_COUNT &&
    maxPlayers <= gameRules.MAX_PLAYERS_COUNT;

  if (!isMaxPlayersValid) {
    return Promise.reject("Max players not valid");
  }

  const newGame = Object.assign(
    {
      name,
      maxPlayers
    },
    {
      id: uuid.v4(),
      status: gameRules.STATUSES.WAITING_FOR_PLAYERS,
      creator: userId,
      creationDate: new Date(),
      players: [
        {
          id: userId
        }
      ]
    }
  );
  games[newGame.id] = newGame;
  wsService.trigger(events.CREATE_GAME, newGame);
  return newGame;
};

const getById = id => games[id];

const removeSecretData = (game, userId) => {
  if (game.status === gameRules.STATUSES.PLAYING) {
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

const format = (game, userId, lightMode) => {
  game = clone(game);
  removeSecretData(game, userId);
  if (lightMode) {
    const WHITE_LIST = [
      "id",
      "creator",
      "creationDate",
      "currentRound",
      "maxPlayers",
      "players",
      "name",
      "status"
    ];
    game = WHITE_LIST.reduce((acc, key) => {
      acc[key] = game[key];
      return acc;
    }, {});
    game.players = game.players.map(({ id, name }) => ({
      id,
      name
    }));
  }
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
  wsService.trigger(events.DELETE_GAME, { gameId });
};

const removePlayer = (gameId, playerId) => {
  const game = getById(gameId);
  if (!game) {
    return "this game does not exist";
  }
  triggerForPlayers(game, events.LEAVE_GAME, {
    playerId
  });
  game.players = game.players.filter(player => player.id !== playerId);
  if (game.players.length === 0) {
    remove(gameId);
    return;
  }
  if (game.creator === playerId) {
    game.creator = game.players[0].id;
  }
  wsService.trigger(events.UPDATE_GAME, {
    id: game.id,
    players: game.players
  });
};

const containsPlayer = (game, playerId) => {
  return game.players.some(player => player.id === playerId);
};

const addPlayer = async (game, playerId) => {
  const newPlayer = await userService.getById(playerId);

  if (!newPlayer) {
    return Promise.reject("this player does not exists");
  }

  game.players.push({
    id: playerId
  });

  triggerForPlayers(game, events.JOIN_GAME, {
    id: newPlayer.id,
    name: newPlayer.name,
    avatarUrl: newPlayer.avatarUrl
  });
  wsService.trigger(events.UPDATE_GAME, {
    id: game.id,
    players: game.players
  });
  return newPlayer;
};

const canKick = (game, userId, kickedPlayerId) =>
  game.creator === userId &&
  game.status === gameRules.STATUSES.WAITING_FOR_PLAYERS &&
  (typeof kickedPlayerId === "undefined" ||
    containsPlayer(game, kickedPlayerId));

const canStart = (game, userId) =>
  game.creator === userId &&
  (game.status === gameRules.STATUSES.WAITING_FOR_PLAYERS ||
    (game.status === gameRules.STATUSES.ROUND_END && game.currentRound < 3)) &&
  game.players.length >= gameRules.MIN_PLAYERS_COUNT;

const start = async game => {
  game.status = gameRules.STATUSES.PLAYING;
  Object.assign(game, {
    status: gameRules.STATUSES.PLAYING,
    deck: saboteurService.buildDeck(),
    currentRound: game.currentRound ? game.currentRound + 1 : 1,
    currentPlayerId: utils.randomPick(game.players).id,
    board: saboteurService.computeInitialBoard(),
    players: saboteurService.distributeRoles(
      game.players.map(saboteurService.formatPlayer)
    )
  });
  saboteurService.distributeCards(game);

  // Trigger for each player, format game
  console.log(JSON.stringify(game, null, 2));
  triggerForPlayersWithAuth(game, events.START_GAME);
  wsService.trigger(events.UPDATE_GAME, {
    id: game.id,
    status: game.status
  });
  return game;
};

const triggerForPlayersWithAuth = async (game, event) => {
  const usersDictionnary = await userService.getAllAsDictionnary();
  game = withUsers(game, usersDictionnary);
  game.players.forEach(player => {
    wsService.trigger(
      events.START_GAME,
      {
        gameId: game.id,
        game: format(game, player.id)
      },
      [player.id]
    );
  });
};

module.exports = {
  addPlayer,
  canKick,
  canStart,
  format,
  getForUser,
  getById,
  insert,
  removePlayer,
  containsPlayer,
  remove,
  start,
  triggerForPlayers,
  triggerForPlayersWithAuth,
  withUsers
};
