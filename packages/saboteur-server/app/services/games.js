const uuid = require("node-uuid");
const clone = require("clone");
const gameRules = require("saboteur-shared/src/game");
const utils = require("saboteur-shared/src/utils");
const events = require("saboteur-shared/src/events");
const userService = require("./user");
const saboteurService = require("./saboteur");
const wsService = require("./ws");

const games = {};

const p1ID = "3073f0be-277c-442e-96c5-325bd2046555";
const p2ID = "7ffec360-4454-4573-9ce2-037a66f72aa4";

games["8e71753b-934c-493d-a400-532409c5ac20"] = {
  chat: [
    {
      messages: []
    }
  ],
  name: "My Super Game",
  maxPlayers: 5,
  id: "8e71753b-934c-493d-a400-532409c5ac20",
  status: "ROUND_END",
  creator: p1ID,
  creationDate: "2017-09-06T09:08:07.624Z",
  players: [
    {
      id: p1ID,
      gold: [3],
      role: "BUILDER",
      name: "Hugo Pievic",
      avatarUrl:
        "https://lh4.googleusercontent.com/-xjC_tP2pf0A/AAAAAAAAAAI/AAAAAAAAAD0/D09zQzqcDGM/photo.jpg"
    },
    {
      id: p2ID,
      gold: [2],
      role: "SABOTEUR",
      name: "pOxaes nz",
      avatarUrl:
        "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg"
    }
  ],
  currentRound: 1,
  winningPlayer: {
    id: p1ID,
    gold: [3],
    role: "BUILDER",
    name: "Hugo Pievic",
    avatarUrl:
      "https://lh4.googleusercontent.com/-xjC_tP2pf0A/AAAAAAAAAAI/AAAAAAAAAD0/D09zQzqcDGM/photo.jpg"
  }
};

function triggerForPlayers(game, event, payload) {
  return wsService.trigger(
    event,
    Object.assign({ gameId: game.id }, payload),
    game.players.map(player => player.id)
  );
}

function getForUser(userId) {
  return Object.values(games).filter(
    game =>
      game.status === gameRules.STATUSES.WAITING_FOR_PLAYERS ||
      game.players.some(player => player.id === userId)
  );
}

async function insert(game, userId) {
  const maxPlayers = parseInt(game.maxPlayers, 10);
  const name = game.name.substring(0, 50);

  const isMaxPlayersValid =
    typeof maxPlayers === "number" &&
    maxPlayers >= gameRules.MIN_PLAYERS_COUNT &&
    maxPlayers <= gameRules.MAX_PLAYERS_COUNT;

  if (!isMaxPlayersValid) {
    return Promise.reject("Max players not valid");
  }

  const user = await userService.getById(userId);

  const newGame = Object.assign(
    { name, maxPlayers },
    {
      id: uuid.v4(),
      status: gameRules.STATUSES.WAITING_FOR_PLAYERS,
      creator: userId,
      chat: [],
      creationDate: new Date(),
      players: [
        {
          id: userId,
          name: user.name,
          avatarUrl: user.avatarUrl
        }
      ]
    }
  );

  games[newGame.id] = newGame;
  wsService.trigger(events.CREATE_GAME, newGame);

  return newGame;
}

function getById(id) {
  return games[id];
}

function removeSecretData(game, userId) {
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
}

function attachAuth(game, userId) {
  const isCreator = userId === game.creator;
  return Object.assign({}, game, {
    _canKick: canKick(game, userId),
    _canDelete: isCreator,
    _hasJoined: containsPlayer(game, userId),
    _canStart: canStart(game, userId)
  });
}

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
function format(game, userId, lightMode) {
  game = clone(game);
  removeSecretData(game, userId);
  if (lightMode) {
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
}

function withUsers(game, usersDictionnary) {
  game = clone(game);
  game.players.forEach(player => {
    player.name = usersDictionnary[player.id].name;
    player.avatarUrl = usersDictionnary[player.id].avatarUrl;
  });
  return game;
}

function remove(gameId) {
  delete games[gameId];
  wsService.trigger(events.DELETE_GAME, { gameId });
}

async function removePlayer(gameId, playerId, isKicked) {
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
  const usersDictionnary = await userService.getAllAsDictionnary();
  const messageEnd = isKicked
    ? "has been kicked from the party"
    : "has left the party";
  createMessage(game, `${usersDictionnary[playerId].name} ${messageEnd}`);
  if (game.creator === playerId) {
    game.creator = game.players[0].id;
    createMessage(
      game,
      `${usersDictionnary[game.creator].name} is now the host`
    );
  }
  wsService.trigger(events.UPDATE_GAME, {
    id: game.id,
    players: game.players
  });
}

function containsPlayer(game, playerId) {
  return game.players.some(player => player.id === playerId);
}

async function addPlayer(game, playerId) {
  const newPlayer = await userService.getById(playerId);

  if (!newPlayer) {
    return Promise.reject("this player does not exists");
  }

  game.players.push({
    id: playerId,
    name: newPlayer.name,
    avatarUrl: newPlayer.avatarUrl
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
  createMessage(game, `${newPlayer.name} has join the party`);
  return newPlayer;
}

function canKick(game, userId, kickedPlayerId) {
  return (
    game.creator === userId &&
    game.status === gameRules.STATUSES.WAITING_FOR_PLAYERS &&
    (typeof kickedPlayerId === "undefined" ||
      containsPlayer(game, kickedPlayerId))
  );
}

function canStart(game, userId) {
  return (
    game.creator === userId &&
    (game.status === gameRules.STATUSES.WAITING_FOR_PLAYERS ||
      (game.status === gameRules.STATUSES.ROUND_END &&
        game.currentRound < 3)) &&
    game.players.length >= gameRules.MIN_PLAYERS_COUNT
  );
}

async function start(game) {
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
  triggerForPlayersWithAuth(game, events.START_GAME);
  wsService.trigger(events.UPDATE_GAME, {
    id: game.id,
    status: game.status
  });
  game.chat = game.chat.filter(chatItem => chatItem.user);
  createMessage(game, [
    "Explorers: find the path to the gold",
    "Natives: protect the gold from explorers",
    "Note: know your role by moving your mouse over the card in the bottom left corner of the window",
    "Let's fight!"
  ]);

  return game;
}

async function triggerForPlayersWithAuth(game, event) {
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
}

function createMessage(game, message, user) {
  let chatElement = {
    messages: typeof message === "string" ? [message] : message
  };
  if (user) {
    const { avatarUrl, id, name } = user;
    chatElement.user = { avatarUrl, id, name };
  }
  var lastMessage = game.chat[game.chat.length - 1];
  if (
    lastMessage &&
    lastMessage.user &&
    user &&
    lastMessage.user.id === user.id
  ) {
    lastMessage.messages.push(message);
    chatElement = lastMessage;
  } else {
    game.chat.push(chatElement);
  }
  triggerForPlayers(game, events.SEND_MESSAGE, chatElement);
}

function addMessage(userId, gameId, message) {
  const game = games[gameId];
  if (!game) {
    return Promise.reject("game does not exist");
  }

  const user = game.players.find(player => player.id === userId);
  if (!user) {
    return Promise.reject("you are not part of this game");
  }

  message = message.trim();

  if (!message || !message.length) {
    return Promise.reject("your message is empty");
  }

  message = message.substring(0, 100);
  createMessage(game, message, user);
}

module.exports = {
  addPlayer,
  addMessage,
  createMessage,
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

games["8e71753b-934c-493d-a400-532409c5ac20"] = {
  chat: [
    {
      messages: [
        "Explorers: find the path to the gold",
        "Natives: protect the gold from explorers",
        "Note: know your role by moving your mouse over the card in the bottom left corner of the window",
        "Let's fight!"
      ]
    }
  ],
  name: "My Super Game",
  maxPlayers: 5,
  id: "8e71753b-934c-493d-a400-532409c5ac20",
  status: "PLAYING",
  creator: "3073f0be-277c-442e-96c5-325bd2046555",
  creationDate: "2017-09-06T09:08:07.624Z",
  players: [
    {
      id: p1ID,
      gold: [3],
      role: "BUILDER",
      name: "Hugo Pievic",
      avatarUrl:
        "https://lh4.googleusercontent.com/-xjC_tP2pf0A/AAAAAAAAAAI/AAAAAAAAAD0/D09zQzqcDGM/photo.jpg",
      malus: [],
      cards: [
        {
          type: "PATH",
          layout: "0001",
          item: "EMPTY",
          id: 1
        },
        {
          type: "PATH",
          layout: "1111",
          item: "EMPTY",
          id: 3
        },
        {
          type: "PATH",
          layout: "1111",
          item: "EMPTY",
          id: 4
        },
        {
          type: "PATH",
          layout: "1111",
          item: "EMPTY",
          id: 5
        },
        {
          type: "PATH",
          layout: "1111",
          item: "EMPTY",
          id: 6
        }
      ]
    },
    {
      id: p2ID,
      gold: [2],
      role: "SABOTEUR",
      name: "pOxaes nz",
      avatarUrl:
        "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
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
          layout: "1111",
          item: "EMPTY",
          id: 7
        },
        {
          type: "PATH",
          layout: "1111",
          item: "EMPTY",
          id: 8
        },
        {
          type: "PATH",
          layout: "1111",
          item: "EMPTY",
          id: 9
        },
        {
          type: "PATH",
          layout: "1111",
          item: "EMPTY",
          id: 10
        }
      ]
    }
  ],
  currentRound: 2,
  winningPlayer: {
    id: p1ID,
    gold: [3],
    role: "BUILDER",
    name: "Hugo Pievic",
    avatarUrl:
      "https://lh4.googleusercontent.com/-xjC_tP2pf0A/AAAAAAAAAAI/AAAAAAAAAD0/D09zQzqcDGM/photo.jpg"
  },
  deck: [
    {
      type: "PATH",
      layout: "1111",
      item: "EMPTY",
      id: 2
    }
  ],
  currentPlayerId: "3073f0be-277c-442e-96c5-325bd2046555",
  board: [
    {
      x: 8,
      y: 2,
      hidden: true,
      layout: "1001",
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
      y: 0,
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
      type: "PATH",
      layout: "1111",
      item: "EMPTY"
    },
    {
      x: 2,
      y: 0,
      type: "PATH",
      layout: "1111",
      item: "EMPTY"
    },
    {
      x: 3,
      y: 0,
      type: "PATH",
      layout: "1111",
      item: "EMPTY"
    },
    {
      x: 4,
      y: 0,
      type: "PATH",
      layout: "1111",
      item: "EMPTY"
    },
    {
      x: 5,
      y: 0,
      type: "PATH",
      layout: "1111",
      item: "EMPTY"
    },
    {
      x: 6,
      y: 0,
      type: "PATH",
      layout: "1111",
      item: "EMPTY"
    },
    {
      x: 6,
      y: 1,
      type: "PATH",
      layout: "1111",
      item: "EMPTY"
    }
  ]
};
