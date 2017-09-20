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
  chat: [],
  name: "My Super Game",
  maxPlayers: 5,
  id: "dad6865a-5c26-4026-9146-d9dfb789af04",
  status: "ROUND_END",
  creator: "47cd89f3-0742-4850-bc6b-e3061ed22170",
  creationDate: "2017-09-06T09:08:07.624Z",
  players: [
    {
      id: "47cd89f3-0742-4850-bc6b-e3061ed22170",
      gold: [3],
      role: "BUILDER",
      name: "Hugo Pievic",
      avatarUrl:
        "https://lh4.googleusercontent.com/-xjC_tP2pf0A/AAAAAAAAAAI/AAAAAAAAAD0/D09zQzqcDGM/photo.jpg?sz=50"
    },
    {
      id: "a0e49070-f02a-4405-bdb7-615564d9e6af",
      gold: [2],
      role: "SABOTEUR",
      name: "pOxaes nz",
      avatarUrl:
        "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50"
    }
  ],
  currentRound: 1,
  winningPlayer: {
    id: "47cd89f3-0742-4850-bc6b-e3061ed22170",
    gold: [3],
    role: "BUILDER",
    name: "Hugo Pievic",
    avatarUrl:
      "https://lh4.googleusercontent.com/-xjC_tP2pf0A/AAAAAAAAAAI/AAAAAAAAAD0/D09zQzqcDGM/photo.jpg?sz=50"
  }
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
      chat: [],
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
  createMessage(game, `${playerId} has left the party`);
  game.players = game.players.filter(player => player.id !== playerId);
  if (game.players.length === 0) {
    remove(gameId);
    return;
  }
  if (game.creator === playerId) {
    game.creator = game.players[0].id;
    createMessage(game, `${game.creator} is now the host`);
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
  createMessage(game, `${newPlayer.name} has join the party`);
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
  triggerForPlayersWithAuth(game, events.START_GAME);
  wsService.trigger(events.UPDATE_GAME, {
    id: game.id,
    status: game.status
  });
  createMessage(game, `Let's fight!`);
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

const createMessage = (game, message, user) => {
  let chatElement = {
    messages: [message]
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
};

const addMessage = (userId, gameId, message) => {
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
};

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
