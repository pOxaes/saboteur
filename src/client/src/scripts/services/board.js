// CARDS

const getLinkedSiblings = (cards, sourceCard) => {
  return cards.filter(card => 
    card.item !== "ROCK"
    && isPathOpen(sourceCard, card)
  );
}

const isPathOpen = (sourceCard, card) =>
     (card.y === sourceCard.y && sourceCard.x === card.x + 1 && card.layout.right)
  || (card.y === sourceCard.y && sourceCard.x === card.x - 1 && card.layout.left)
  || (card.x === sourceCard.x && sourceCard.y === card.y + 1 && card.layout.top)
  || (card.x === sourceCard.x && sourceCard.y === card.y - 1 && card.layout.bottom);

const getCardByCoord = (cards, { x, y }) => {
  return cards.find(card => card.x === x && card.y === y);
}

const containsSlot = (cards, { x, y }) => cards.some(card => card.y === y && card.x === x);

const slotToCoords = ({ x, y }) => ({ x, y });

const getSiblingsFromMultipleCards = (sourceCards, forbiddenCoords, cards) => {
  return sourceCards
    .map(card => getLinkedSiblings(cards, card))
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

  let siblings = getLinkedSiblings(cards, card);
  let siblingsCache = siblings.map(slotToCoords).concat(slotToCoords(card));

  while (!containsSlot(siblings, {x: 0, y: 0}) && siblings.length && loop < 100) {
    loop++;
    siblings = getSiblingsFromMultipleCards(siblings, siblingsCache, cards);
  }

  return siblings.length;
}

// SLOTS

const boardItemToCard = ({ layout, item }) => ({
  layout,
  item,
  type: "PATH",
});

const findSlot = (slots, x, y) => slots.find(slot => slot.x === x && slot.y === y);

const updateSlot = (slots, x, y, card, shouldForce) => {
  const existingSlot = findSlot(slots, x, y);
  if (existingSlot && (!existingSlot.card || shouldForce)) {
    existingSlot.card = card;
  } else if (!existingSlot) {
    const newSlot = {
      x,
      y,
      card,
    };
    slots.push(newSlot);
  }  
}

const createSlotsFromCards = cards => {
  // Create card slots + empty slot
  const slots = cards.reduce((acc, card) => {
    updateSlot(acc, card.x, card.y, boardItemToCard(card));
    if (card.layout && card.isLinkedToStart) {
      if (card.layout.top) {
        updateSlot(acc, card.x, card.y - 1);
      }
      if (card.layout.bottom) {
        updateSlot(acc, card.x, card.y + 1);
      }
      if (card.layout.left) {
        updateSlot(acc, card.x - 1, card.y);
      }
      if (card.layout.right) {
        updateSlot(acc, card.x + 1, card.y);
      }
    }
    return acc;
  }, []);

  // Attach authorized layout for each empty slot
  slots
    .filter(slot => !slot.card)
    .forEach(slot => {
      const siblingsCoords = {
        top: {
          x: slot.x,
          y: slot.y - 1,
        },
        right: {
          x: slot.x + 1,
          y: slot.y,
        },
        bottom: {
          x: slot.x,
          y: slot.y + 1,
        },
        left: {
          x: slot.x - 1,
          y: slot.y,
        }
      };

      slot.authorizedLayout = Object.keys(siblingsCoords).reduce((acc, side) => {
        const sideCard = getCardByCoord(cards, siblingsCoords[side]);
        if (sideCard) {
          acc[side] = isPathOpen(slot, sideCard);
        }
        return acc;
      }, {});
    });

  return slots;
};

const compareLayouts = (authLayout, checkedLayout) => Object.keys(authLayout)
  .every(side => authLayout[side] === checkedLayout[side]);

const rotateLayout = ({ top, right, bottom, left }) => ({
  top: bottom,
  right: left,
  bottom: top,
  left: right,
});

const checkCardCompatibility = (card, slot) => {
  return compareLayouts(slot.authorizedLayout, card.layout)
    || compareLayouts(slot.authorizedLayout, rotateLayout(card.layout));
};

export default {
  checkCardCompatibility,
  createSlotsFromCards,
  isLinkedToStart,
};