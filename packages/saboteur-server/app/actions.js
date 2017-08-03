const Promise = require("bluebird");
const events = require("saboteur-shared/src/events");
const gameRules = require("saboteur-shared/src/game");
const gamesService = require("./services/games");
const { playCard } = require("./services/cardPlayHandler");
const userService = require("./services/user");

module.exports = {
  [events.GET_GAMES]: async ({ ws }) => {
    const games = await gamesService.getForUser(ws.userId);
    const dispatchedGames = games.reduce(
      (acc, game) => {
        let dest;
        switch (game.status) {
          case gameRules.STATUSES.WAITING_FOR_PLAYERS:
            dest = acc.lobby;
            break;
          case gameRules.STATUSES.COMPLETED:
          case gameRules.STATUSES.ROUND_END:
          case gameRules.STATUSES.PLAYING:
            dest = acc.playing;
            break;
        }
        const formattedGame = gamesService.format(game, ws.userId);
        dest.push(formattedGame);
        return acc;
      },
      {
        playing: [],
        lobby: []
      }
    );
    return dispatchedGames;
  },

  [events.GET_GAME]: async ({ ws }, gameId) => {
    const game = gamesService.getById(gameId);
    if (!game) {
      return Promise.reject("This game does not exists");
    }
    // if player is not in the game
    if (!gamesService.containsPlayer(game, ws.userId)) {
      // and if game is not waiting for players then do not return it
      if (game.status !== gameRules.STATUSES.WAITING_FOR_PLAYERS) {
        return Promise.reject("You cannot get this game");
      }
      // or make him join
      await gamesService.addPlayer(game, ws.userId);
    }
    const usersDictionnary = await userService.getAllAsDictionnary();
    return gamesService.withUsers(
      gamesService.format(game, ws.userId),
      usersDictionnary
    );
  },

  [events.CREATE_GAME]: async ({ ws }, game) =>
    gamesService.insert(game, ws.userId),

  [events.LEAVE_GAME]: async ({ ws }, gameId) => {
    gamesService.removePlayer(gameId, ws.userId);
    return;
  },

  [events.KICK_PLAYER]: async ({ ws }, { gameId, playerId }) => {
    const game = gamesService.getById(gameId);
    if (!gamesService.canKick(game, playerId, ws.userId)) {
      return Promise.reject("You cannot kick");
    }
    gamesService.removePlayer(gameId, playerId);
    return game;
  },

  [events.DELETE_GAME]: ({ ws }, gameId) => {
    const game = gamesService.getById(gameId);
    if (game.creator === ws.userId) {
      gamesService.remove(gameId);
    }
  },

  [events.START_GAME]: ({ ws }, gameId) => {
    const game = gamesService.getById(gameId);
    if (!gamesService.canStart(game, ws.userId)) {
      return Promise.reject("You cannot start this game");
    }
    gamesService.start(game);
    return;
  },

  [events.JOIN_GAME]: async ({ ws }, gameId) =>
    gamesService.addPlayer(gameId, playerId),

  [events.PLAY_CARD]: ({ ws }, { gameId, cardId, isRotated, destination }) => {
    playCard(ws.userId, gameId, cardId, isRotated, destination);
  }
};
