import boardRules from "saboteur-shared/dist/board";
import gameRules from "saboteur-shared/dist/game";

const TEAMS = {
  BUILDER: "explorators",
  SABOTEUR: "natives"
};

export const getCurrentPlayerIndex = (players, userId) =>
  players.map(player => player.id).indexOf(userId);

export const canRotate = layout =>
  layout.top !== layout.bottom || layout.left !== layout.right;

export const format = (game, currentPlayerIndex) => {
  // TODO: refacto, ugly side effects
  game.board.forEach(boardRules.formatCardLayout);
  game.board.forEach(boardRules.attachLinkedToStart);

  const slots = boardRules.createSlotsFromCards(game.board);

  // format current player cards
  game.players[currentPlayerIndex].cards.forEach(card => {
    boardRules.formatCardLayout(card);
    if (card.layout) {
      card.canRotate = canRotate(card.layout);
      card.isRotated = false;
    }
  });

  return { game, slots };
};

export const canPlay = ({ selectedCard, type, destinationItem, userId }) => {
  return (
    selectedCard &&
    (type === gameRules.DESTINATION_TYPES.DISCARD ||
      (destinationItem.isHighlighted ||
        (type === "PLAYER" && destinationItem.id === userId)))
  );
};

export const shiftPlayers = (players, currentPlayerIndex) => {
  const shiftedPlayers = [];
  for (
    let i = currentPlayerIndex + 1,
      playersLen = players.length,
      max = currentPlayerIndex + playersLen;
    i < max;
    i++
  ) {
    shiftedPlayers.push(players[i % playersLen]);
  }
  return shiftedPlayers;
};

export const teamToLabel = team => TEAMS[team];

export default {
  canPlay,
  format,
  getCurrentPlayerIndex,
  shiftPlayers,
  canRotate,
  teamToLabel
};
