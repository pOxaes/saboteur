const getSiblings = (cards, sourceCard) => {
  return cards.filter(card => 
    card.item !== "ROCK"
    && (
         (card.y === sourceCard.y && sourceCard.x === card.x + 1 && card.layout.right)
      || (card.y === sourceCard.y && sourceCard.x === card.x - 1 && card.layout.left)
      || (card.x === sourceCard.x && sourceCard.y === card.y + 1 && card.layout.top)
      || (card.x === sourceCard.x && sourceCard.y === card.y - 1 && card.layout.bottom)
    )
  );
}

const containsSlot = (cards, { x, y }) => cards.some(card => card.y === y && card.x === x);

const slotToCoords = ({ x, y }) => ({ x, y });

const getSiblingsFromMultipleCards = (sourceCards, forbiddenCoords, cards) => {
  return sourceCards
    .map(card => getSiblings(cards, card))
    .reduce((acc, siblings) => acc.concat(siblings))
    .filter(card => {
      return !containsSlot(forbiddenCoords, card);
    });
}

const isLinkedToStart = (card, cards) => {
  let loop = 0;
  if (card.x === 0 && card.y === 0) {
    return true;
  }

  if (card.item === 'ROCK') {
    return false;
  }

  let siblings = getSiblings(cards, card);
  let siblingsCache = siblings.map(slotToCoords).concat(slotToCoords(card));

  while (!containsSlot(siblings, {x: 0, y: 0}) && siblings.length && loop < 100) {
    loop++;
    siblings = getSiblingsFromMultipleCards(siblings, siblingsCache, cards);
  }

  return siblings.length;
}

export default {
  isLinkedToStart,
};