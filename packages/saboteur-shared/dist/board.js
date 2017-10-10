"use strict";

// CARDS

var getLinkedSiblings = function getLinkedSiblings(cards, sourceCard) {
  return cards.filter(function(card) {
    return card.item !== "ROCK" && isPathOpen(sourceCard, card);
  });
};

var isPathOpen = function isPathOpen(sourceCard, card) {
  return (
    (card.y === sourceCard.y &&
      sourceCard.x === card.x + 1 &&
      (!sourceCard.layout || sourceCard.layout.left) &&
      (card.hidden || card.layout.right)) ||
    (card.y === sourceCard.y &&
      sourceCard.x === card.x - 1 &&
      (!sourceCard.layout || sourceCard.layout.right) &&
      (card.hidden || card.layout.left)) ||
    (card.x === sourceCard.x &&
      sourceCard.y === card.y - 1 &&
      (!sourceCard.layout || sourceCard.layout.bottom) &&
      (card.hidden || card.layout.top)) ||
    (card.x === sourceCard.x &&
      sourceCard.y === card.y + 1 &&
      (!sourceCard.layout || sourceCard.layout.top) &&
      (card.hidden || card.layout.bottom))
  );
};

var getCardByCoord = function getCardByCoord(cards, _ref) {
  var x = _ref.x,
    y = _ref.y;

  return cards.find(function(card) {
    return card.x === x && card.y === y;
  });
};

var containsSlot = function containsSlot(cards, _ref2) {
  var x = _ref2.x,
    y = _ref2.y;
  return cards.some(function(card) {
    return card.y === y && card.x === x;
  });
};

var slotToCoords = function slotToCoords(_ref3) {
  var x = _ref3.x,
    y = _ref3.y;
  return { x: x, y: y };
};

var getSiblingsFromMultipleCards = function getSiblingsFromMultipleCards(
  sourceCards,
  forbiddenCoords,
  cards
) {
  return sourceCards
    .map(function(card) {
      return getLinkedSiblings(cards, card);
    })
    .reduce(function(acc, siblings) {
      return acc.concat(siblings);
    })
    .filter(function(card) {
      return !containsSlot(forbiddenCoords, card);
    });
};

var isLinkedToStart = function isLinkedToStart(card, cards) {
  var maxLoop = 30;
  var loop = 0;
  if (card.x === 0 && card.y === 0) {
    return true;
  }

  if (card.item === "ROCK") {
    return false;
  }

  var siblings = getLinkedSiblings(cards, card);
  var siblingsCache = siblings.map(slotToCoords).concat(slotToCoords(card));

  while (
    !containsSlot(siblings, { x: 0, y: 0 }) &&
    siblings.length &&
    loop < maxLoop
  ) {
    loop++;
    siblings = getSiblingsFromMultipleCards(siblings, siblingsCache, cards);
    siblingsCache = siblingsCache.concat(siblings);
  }
  return !!siblings.length;
};

var attachLinkedToStart = function attachLinkedToStart(card, index, cards) {
  card.isLinkedToStart = isLinkedToStart(card, cards);
};

// SLOTS

var boardItemToCard = function boardItemToCard(_ref4) {
  var layout = _ref4.layout,
    item = _ref4.item,
    hidden = _ref4.hidden;
  return {
    layout: layout,
    item: item,
    hidden: hidden,
    type: "PATH"
  };
};

var findSlot = function findSlot(slots, x, y) {
  return slots.find(function(slot) {
    return slot.x === x && slot.y === y;
  });
};

var updateSlot = function updateSlot(slots, x, y, card, shouldForce) {
  var existingSlot = findSlot(slots, x, y);
  if (existingSlot && (!existingSlot.card || shouldForce)) {
    existingSlot.card = card;
  } else if (!existingSlot) {
    var newSlot = {
      x: x,
      y: y,
      card: card
    };
    slots.push(newSlot);
  }
};

var createSlotsFromCards = function createSlotsFromCards(cards) {
  // Create card slots + empty slot
  var slots = cards.reduce(function(acc, card) {
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
    .filter(function(slot) {
      return !slot.card;
    })
    .forEach(function(slot) {
      var siblingsCoords = {
        top: {
          x: slot.x,
          y: slot.y - 1
        },
        right: {
          x: slot.x + 1,
          y: slot.y
        },
        bottom: {
          x: slot.x,
          y: slot.y + 1
        },
        left: {
          x: slot.x - 1,
          y: slot.y
        }
      };

      slot.authorizedLayout = Object.keys(siblingsCoords).reduce(function(
        acc,
        side
      ) {
        var sideCard = getCardByCoord(cards, siblingsCoords[side]);
        if (sideCard && !sideCard.hidden) {
          acc[side] = isPathOpen(slot, sideCard);
        }
        return acc;
      }, {});
    });

  return slots;
};

var compareLayouts = function compareLayouts(authLayout, checkedLayout) {
  return Object.keys(authLayout).every(function(side) {
    return authLayout[side] === checkedLayout[side];
  });
};

var rotateLayout = function rotateLayout(_ref5) {
  var top = _ref5.top,
    right = _ref5.right,
    bottom = _ref5.bottom,
    left = _ref5.left;
  return {
    top: bottom,
    right: left,
    bottom: top,
    left: right
  };
};

var rotateStringLayout = function rotateStringLayout(layout) {
  return layout.slice(-2) + layout.slice(0, 2);
};

var checkCardCompatibility = function checkCardCompatibility(card, slot) {
  var shouldCompareRotation =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  return (
    compareLayouts(slot.authorizedLayout, card.layout) ||
    (shouldCompareRotation &&
      compareLayouts(slot.authorizedLayout, rotateLayout(card.layout)))
  );
};

var formatCardLayout = function formatCardLayout(card) {
  if (card.layout && typeof card.layout === "string") {
    card.layout = {
      top: card.layout[0] === "1",
      right: card.layout[1] === "1",
      bottom: card.layout[2] === "1",
      left: card.layout[3] === "1"
    };
  }
};

var formatLayoutToString = function formatLayoutToString(layout) {
  return [
    layout.top ? 1 : 0,
    layout.right ? 1 : 0,
    layout.bottom ? 1 : 0,
    layout.left ? 1 : 0
  ].join("");
};

// const attachPlayability = (card, slots, players) => {
//   if (card.type === "HIDDEN") {
//     return;
//   }
//   if (card.action === "REVEAL") {
//     card.isPlayable = slots.some(
//       slot => slot.card && slot.card.type === "PATH" && slot.card.hidden
//     );
//     return;
//   }

//   // Can destroy if a card, different from the origin, exists
//   if (card.action === "DESTROY") {
//     card.isPlayable = slots.some(
//       slot => slot.card && slot.card.layout && (slot.x !== 0 || slot.y !== 0)
//     );
//     return;
//   }

//   if (card.action === "BLOCK") {
//     card.isPlayable = players.some(
//       player => !player.malus || player.malus.length === 0
//     );
//     return;
//   }

//   if (card.action === "FREE") {
//     card.isPlayable = players.some(
//       player =>
//         player.malus &&
//         player.malus.some(malus => card.subtype.indexOf(malus) !== -1)
//     );
//     return;
//   }

//   if (card.type === "PATH") {
//     card.isPlayable = slots.some(
//       slot => !slot.card && checkCardCompatibility(card, slot)
//     );
//   }
// };

var canPlayCardOnPlayer = function canPlayCardOnPlayer(card, player) {
  return (
    (card.action === "BLOCK" && (!player.malus || !player.malus.length)) ||
    (card.action === "FREE" &&
      player.malus &&
      player.malus.some(function(malus) {
        return card.subtype.indexOf(malus) !== -1;
      }))
  );
};

var canPlayCardOnSlot = function canPlayCardOnSlot(card, slot, player) {
  if (player.malus && player.malus.length && card.type === "PATH") {
    return false;
  }

  return (
    (card.action === "REVEAL" &&
      slot.card &&
      slot.card.type === "PATH" &&
      slot.card.hidden) ||
    (card.action === "DESTROY" &&
      slot.card &&
      slot.card.layout &&
      (slot.x !== 0 || slot.y !== 0)) ||
    (card.type === "PATH" &&
      slot.authorizedLayout &&
      checkCardCompatibility(card, slot, false))
  );
};

var rotateCardLayout = function rotateCardLayout(card) {
  card.layout = rotateLayout(card.layout);
  card.isRotated = !card.isRotated;
};

module.exports = {
  // attachPlayability,
  checkCardCompatibility: checkCardCompatibility,
  createSlotsFromCards: createSlotsFromCards,
  formatCardLayout: formatCardLayout,
  formatLayoutToString: formatLayoutToString,
  attachLinkedToStart: attachLinkedToStart,
  rotateCardLayout: rotateCardLayout,
  rotateStringLayout: rotateStringLayout,
  canPlayCardOnPlayer: canPlayCardOnPlayer,
  canPlayCardOnSlot: canPlayCardOnSlot,
  getLinkedSiblings: getLinkedSiblings,
  isPathOpen: isPathOpen
};
