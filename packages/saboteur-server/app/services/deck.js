const deck = [
  {
    layout: "1110",
    count: 5
  },
  {
    layout: "1101",
    count: 5
  },
  {
    layout: "1010",
    count: 4
  },
  {
    layout: "0101",
    count: 4
  },
  {
    layout: "1111",
    count: 5
  },
  {
    layout: "1100",
    count: 4
  },
  {
    layout: "0110",
    count: 4
  },

  // BLOCKERS

  {
    layout: "0100",
    count: 2
  },
  {
    layout: "0100",
    count: 2
  },
  {
    layout: "1110",
    item: "ROCK",
    count: 1
  },
  {
    layout: "1101",
    item: "ROCK",
    count: 1
  },
  {
    layout: "1010",
    item: "ROCK",
    count: 1
  },
  {
    layout: "0101",
    item: "ROCK",
    count: 1
  },
  {
    layout: "1111",
    item: "ROCK",
    count: 2
  },
  {
    layout: "1100",
    item: "ROCK",
    count: 1
  },
  {
    layout: "0110",
    item: "ROCK",
    count: 1
  },

  // ACTIONS

  {
    subtype: ["PICKAXE"],
    action: "BLOCK",
    count: 3
  },
  {
    subtype: ["PICKAXE"],
    action: "FREE",
    count: 2
  },
  {
    subtype: ["LIGHT"],
    action: "BLOCK",
    count: 3
  },
  {
    subtype: ["LIGHT"],
    action: "FREE",
    count: 2
  },
  {
    subtype: ["CHARIOT"],
    action: "BLOCK",
    count: 3
  },
  {
    subtype: ["CHARIOT"],
    action: "FREE",
    count: 2
  },
  {
    subtype: ["LIGHT"],
    action: "FREE",
    count: 2
  },
  {
    subtype: ["LIGHT", "CHARIOT"],
    action: "FREE",
    count: 1
  },
  {
    subtype: ["LIGHT", "PICKAXE"],
    action: "FREE",
    count: 1
  },
  {
    subtype: ["CHARIOT", "PICKAXE"],
    action: "FREE",
    count: 1
  },
  {
    action: "REVEAL",
    count: 6
  },
  {
    action: "DESTROY",
    count: 3
  }
];

module.exports = deck;
