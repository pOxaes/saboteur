const CARD_ACTION = {
  DESTROY: "destroyed",
  REVEAL: "revealed",
  FREE: "liberated",
  BLOCK: "blocked"
};

function isOpen(isOpen) {
  return isOpen;
}

function countOpenSides(layout) {
  return Object.values(layout).filter(isOpen).length;
}

function pathToText({ layout, item }) {
  let str = "a turn path";

  if (layout.top && layout.right && layout.bottom && layout.left) {
    str = "a cross path";
  } else if (countOpenSides(layout) === 3) {
    str = "a 3 open path";
  } else if (layout.top && layout.bottom) {
    str = "a vertical path";
  } else if (layout.left && layout.right) {
    str = "an horizontal path";
  } else if (countOpenSides(layout) === 1) {
    str = "a dead end";
  }

  if (item === "ROCK") {
    return `${str} with a snake`;
  }

  return str;
}

function getPlayerAction(card) {
  switch (card.type) {
    case "PATH":
      return `put ${pathToText(card)} on `;
    case "ACTION":
      return CARD_ACTION[card.action];
  }
}

function getDestination(destination) {
  let str = "";
  if (destination.name) {
    return destination.name;
  }
  if (destination.card && !destination.card.hidden) {
    str = `${pathToText(destination.card)} on `;
  }
  if (destination.hasOwnProperty("x")) {
    return `${str}slot ${destination.x} ${destination.y}`;
  }
}

function compute({ player, card, destination }) {
  if (destination.type === "DISCARD") {
    return `${player.name} threw a card`;
  }

  return `${player.name} ${getPlayerAction(card)} ${getDestination(
    destination
  )}`;
}

module.exports = {
  compute
};
