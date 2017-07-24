import request from "../services/request";

const baseUrl = "http://localhost:3008";

const kick = ({ gameId, playerId }) =>
  request.post(`${baseUrl}/games/${gameId}/kick`, { playerId })
    .then(() => {
      console.log(`${playerId} kicked from game ${gameId}`);
    });

const playCard = ({ gameId, cardId, isRotated, destination }) =>
  request.post(`${baseUrl}/games/${gameId}/play`, { cardId, isRotated, destination })
    .then(() => {
      console.log(`played card ${cardId} on ${destination.type}`);
    });

const getGame = gameId => request.get(`${baseUrl}/games/${gameId}`);

const getGames = () => request.get(`${baseUrl}/games`);

const joinGame = gameId => request.post(`${baseUrl}/games/${gameId}/join`);

const createGame = ({ name, maxPlayers }) => request.post(`${baseUrl}/games`, { name, maxPlayers });

const startGame = gameId => request.post(`${baseUrl}/games/${gameId}/start`);

const deleteGame = gameId => request.post(`${baseUrl}/games/${gameId}/delete`);

export default {
  createGame,
  deleteGame,
  getGame,
  getGames,
  joinGame,
  kick,
  playCard,
  startGame,
};