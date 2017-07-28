const Promise = require("bluebird");
const events = require("./events");
const gamesService = require("./services/games");
const userService = require("./services/user");

module.exports = {
  [events.GET_GAMES]: async ({ ws }) => {
    const games = await gamesService.getForUser(ws.userId);
    const dispatchedGames = games.reduce(
      (acc, game) => {
        let dest;
        switch (game.status) {
          case gamesService.STATUSES.WAITING_FOR_PLAYERS:
            dest = acc.lobby;
            break;
          case gamesService.STATUSES.PLAYING:
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
    // if player is not in the game
    if (!gamesService.containsPlayer(game, ws.userId)) {
      // and if game is not waiting for players then do not return it
      if (game.status !== gamesService.STATUSES.WAITING_FOR_PLAYERS) {
        // TODO: return an error & reject
        console.log("FORBIDDEN");
        return undefined;
      }
      // or make him join
      gamesService.addPlayer(game, ws.userId);
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

  [events.DELETE_GAME]: async ({ ws }, gameId) => {
    const game = gamesService.getById(gameId);
    if (game.creator === ws.userId) {
      gamesService.remove(gameId);
    }
    return;
  },

  [events.JOIN_GAME]: async ({ ws }, gameId) =>
    gamesService.addPlayer(gameId, playerId)
};
