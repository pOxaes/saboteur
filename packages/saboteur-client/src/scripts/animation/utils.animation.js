export const ROTATE_START = -25;
export const ROTATE_STEP = 10;
export const MARGIN_BY_INDEX = [0, -10, -15, -15, -10, 0];

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

export const clearStyle = el => el.removeAttribute("style");

export const getNextSiblings = element => {
  const nextSiblings = [];
  while (element.nextSibling) {
    element = element.nextSibling;
    nextSiblings.push(element);
  }
  return nextSiblings;
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
