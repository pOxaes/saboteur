import request from "../services/request";
import wsService from "../services/ws";
import events from "./events";

const baseUrl = "http://localhost:3008/api";

const kick = ({ gameId, playerId }) =>
  wsService.emitPromise(events.KICK_PLAYER, { gameId, playerId });

const playCard = ({ gameId, cardId, isRotated, destination }) =>
  request
    .post(`${baseUrl}/games/${gameId}/play`, { cardId, isRotated, destination })
    .then(() => {
      console.log(`played card ${cardId} on ${destination.type}`);
    });

const getGame = gameId => wsService.emitPromise(events.GET_GAME, gameId);

const getGames = () => wsService.emitPromise(events.GET_GAMES);

const joinGame = gameId => wsService.emitPromise(events.JOIN_GAME, gameId);

const createGame = ({ name, maxPlayers }) =>
  wsService.emitPromise(events.CREATE_GAME, { name, maxPlayers });

const startGame = gameId => wsService.emitPromise(events.START_GAME, gameId);

const deleteGame = gameId => wsService.emitPromise(events.DELETE_GAME, gameId);

const leaveGame = gameId => wsService.emitPromise(events.LEAVE_GAME, gameId);

const login = googleAuthorizationCode =>
  request.post(`${baseUrl}/login`, googleAuthorizationCode);

export default {
  createGame,
  deleteGame,
  getGame,
  getGames,
  joinGame,
  kick,
  leaveGame,
  login,
  playCard,
  startGame
};
