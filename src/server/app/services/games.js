const uuid = require("node-uuid");
const userService = require("./user");

const games = {};

// TODO: remove me

games["e6f00b55-c1f2-46d7-9057-e5a0c0b55ce9"] = {
  name: "My Super Game",
  maxPlayers: "5",
  id: "e6f00b55-c1f2-46d7-9057-e5a0c0b55ce9",
  status: "WAITING_FOR_PLAYERS",
  creator: "bdebad6b-1931-4ad1-80e2-5cc765158b7f",
  creationDate: new Date(),
  players: [{ id: "bdebad6b-1931-4ad1-80e2-5cc765158b7f" }]
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

const format = (game, userId) => {
  return Object.assign({}, game, {
    _canKick:
      game.status === STATUSES.WAITING_FOR_PLAYERS && userId === game.creator,
    _canDelete: userId === game.creator,
    _hasJoined: containsPlayer(game, userId)
  });
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

module.exports = {
  STATUSES,
  addPlayer,
  format,
  getForUser,
  getById,
  insert,
  removePlayer,
  containsPlayer,
  remove,
  withUsers
};
