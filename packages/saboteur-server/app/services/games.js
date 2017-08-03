const uuid = require("node-uuid");
const clone = require("clone");
const gameRules = require("saboteur-shared/src/game");
const utils = require("saboteur-shared/src/utils");
const events = require("saboteur-shared/src/events");
const userService = require("./user");
const saboteurService = require("./saboteur");
const wsService = require("./ws");

const games = {};

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

const insert = (game, userId) => {
  const newGame = Object.assign({}, game, {
    id: uuid.v4(),
    status: gameRules.STATUSES.WAITING_FOR_PLAYERS,
    creator: userId,
    creationDate: new Date(),
    players: [
      {
        id: userId
      }
    ]
  });
  games[newGame.id] = newGame;
  wsService.trigger(events.CREATE_GAME, newGame);
  return newGame;
};

const getById = id => games[id];

const removeSecretData = (game, userId) => {
  if (game.status === gameRules.STATUSES.PLAYING) {
    game.deck = game.deck.length;
    game.board.forEach(card => {
      if (
        card.hidden &&
        !saboteurService.isUserAllowedToSeeHiddenCard(userId, card.allowedUsers)
      ) {
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
  wsService.trigger(events.DELETE_GAME, { gameId });
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
  triggerForPlayers(game, events.LEAVE_GAME, {
    playerId
  });
};

const containsPlayer = (game, playerId) => {
  return game.players.some(player => player.id === playerId);
};

const addPlayer = async (game, playerId) => {
  game.players.push({
    id: playerId
  });
  const { id, name, avatarUrl } = await userService.getById(playerId);
  triggerForPlayers(game, events.JOIN_GAME, {
    id,
    name,
    avatarUrl
  });
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
