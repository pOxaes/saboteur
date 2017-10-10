import events from "saboteur-shared/dist/events";
import request from "../services/request";
import wsService from "../services/ws";

// TODO: check all emitPromise
// use emit if no promise required

const kick = ({ gameId, playerId }) =>
  wsService.emitPromise(events.KICK_PLAYER, { gameId, playerId });

const playCard = ({ gameId, cardId, isRotated, destination }) =>
  wsService.emitPromise(events.PLAY_CARD, {
    gameId,
    cardId,
    isRotated,
    destination
  });

const getGame = gameId => wsService.emitPromise(events.GET_GAME, gameId);

const getGames = () => wsService.emitPromise(events.GET_GAMES);

const joinGame = gameId => wsService.emitPromise(events.JOIN_GAME, gameId);

const createGame = ({ name, maxPlayers }) =>
  wsService.emitPromise(events.CREATE_GAME, { name, maxPlayers });

const startGame = gameId => wsService.emit(events.START_GAME, gameId);

const deleteGame = gameId => wsService.emit(events.DELETE_GAME, gameId);

const leaveGame = gameId => wsService.emitPromise(events.LEAVE_GAME, gameId);

const sendMessage = ({ message, gameId }) =>
  wsService.emit(events.SEND_MESSAGE, { message, gameId });

const login = googleAuthorizationCode =>
  request.post(
    `${process.env.REACT_APP_HOST}/api/login`,
    googleAuthorizationCode
  );

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
  startGame,
  sendMessage
};
