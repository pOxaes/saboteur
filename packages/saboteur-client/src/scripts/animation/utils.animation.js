export const getPlayer = (parent, playerId) =>
  parent.querySelector(`#player-${playerId}`);

export const getCard = (parent, cardId, playerId) => {
  let card = parent.querySelector(`#card-${cardId}`);
  if (!card) {
    const player = getPlayer(parent, playerId);
    card = player.querySelector(`.player__cards__card-wrapper`);
  }
  return card;
};

export const setStyle = (element, styleObj) => {
  Object.keys(styleObj).forEach(
    styleProp => (element.style[styleProp] = styleObj[styleProp])
  );
};

export default {
  getCard,
  getPlayer,
  setStyle
};
