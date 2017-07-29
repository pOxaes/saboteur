const deck = [
  {
    layout: "1110",
    count: 4
  },
  {
    layout: "1101",
    count: 4
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
    count: 4
  },
  {
    layout: "1100",
    count: 4
  },
  {
    layout: "0110",
    count: 4
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
    count: 1
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
  {
    subtype: ["PICKAXE"],
    action: "BLOCK",
    count: 3
  },
  {
    subtype: ["PICKAXE"],
    action: "FREE",
    count: 3
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
    subtype: ["LIGHT"],
    action: "FREE",
    count: 2
  },
  {
    subtype: ["LIGHT", "CHARIOT"],
    action: "FREE",
    count: 2
  },
  {
    subtype: ["LIGHT", "PICKAXE"],
    action: "FREE",
    count: 2
  },
  {
    subtype: ["CHARIOT", "PICKAXE"],
    action: "FREE",
    count: 2
  },
  {
    action: "REVEAL",
    count: 4
  },
  {
    action: "DESTROY",
    count: 4
  }
];

module.exports = deck;
