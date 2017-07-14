import React from "react";
import "../../styles/Card.css";

const computeCardClass = card =>
  [
    "card",
    `card--${card.type}`, 
    card.action && `card--action-${card.action}`,
    card.item && `card--item-${card.item}`,
    card.subtype && card.subtype.map(subtype => `card--subtype-${subtype}`).join(" ")
  ].join(" ");

export default ({ card, onClick }) =>
  <div
    className={computeCardClass(card)}
    onClick={() => {
      onClick && onClick(card);
    }}
  >
    <div className="card__inner">
    
    {card.item && <div className={`card__item card__item--${card.item}`} />}
    {card.subtype && card.subtype.length &&
      card.subtype.map((subtype, index) =>
        <span className="card__subtype" key={index}>{subtype}</span>
    )} 
      <small>
        {card.item} {card.layout}
      </small>
    </div>
  </div>;

// {
//   type: ACTION | PATH | HIDDEN
//   action: DESTROY | BLOCK | FREE, // for type === ACTION
//   subtype: [ PICKAXE | LIGHT | CHARIOT ], // for action === BLOCK | FREE
//   item: GOLD | ROCK | LADDER | EMPTY // for type === PATH
//   layout: 1 | 0 {4}
// }
