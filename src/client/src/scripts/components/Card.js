import React from "react";

const computeCardClass = card =>
  ["card", `card--${card.type}`, card.action && `card--${card.action}`].join(
    " "
  );

export default ({ card, onClick }) =>
  <div
    className={computeCardClass(card)}
    onClick={() => {
      onClick && onClick(card);
    }}
  >
    {card.item && <div className={`card__item card__item--${card.item}`} />}
    card {card.type} {card.action} {card.subtype} {card.item} {card.layout}
  </div>;

// {
//   type: ACTION | PATH
//   action: DESTROY | BLOCK | FREE, // for type === ACTION
//   subtype: [ PICKAXE | LIGHT | CHARIOT ], // for action === BLOCK | FREE
//   item: GOLD | ROCK | LADDER | EMPTY // for type === PATH
//   layout: 1 | 0 {4}
// }
