import React from "react";

export default ({ card, onClick }) =>
  <div
    className="card"
    onClick={() => {
      onClick && onClick(card);
    }}>
    {card || "card"}
  </div>;

// {
//   type: ACTION | PATH
//   action: DESTRUCTION | BLOCK | FREE, // for type === ACTION
//   subtype: [ PICKAXE | LIGHT | CHARIOT ], // for action === BLOCK | FREE
//   item: GOLD | ROCK | LADDER | EMPTY // for type === PATH
//   layout: 1 | 0 {4}
// }
