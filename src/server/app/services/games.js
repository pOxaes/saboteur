const uuid = require("node-uuid");
const userService = require("./user");
const saboteurService = require("./saboteur");
const utils = require("./utils");
const clone = require("clone");

const games = {};

// TODO: remove me

games["e6f00b55-c1f2-46d7-9057-e5a0c0b55ce9"] = {
  name: "My Super Game",
  maxPlayers: 7,
  id: "e6f00b55-c1f2-46d7-9057-e5a0c0b55ce9",
  status: "WAITING_FOR_PLAYERS",
  creator: "bdebad6b-1931-4ad1-80e2-5cc765158b7f",
  creationDate: new Date(),
  players: [
    { id: "bdebad6b-1931-4ad1-80e2-5cc765158b7f" },
    { id: "564857c4-ab96-47a9-aa0f-44306e414138" }
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
  game.players.length > saboteurService.MIN_PLAYERS_COUNT;

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

module.exports = {
  STATUSES,
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
  withUsers
};
