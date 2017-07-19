import React from "react";
import CardLayout from "./CardLayout"
import "../../styles/Card.css";

const computeCardClass = (card, modifiers = {}) =>
  [
    "card",
    card.isPlayable && "card--is-playable",
    `card--${card.type}`, 
    card.action && `card--action-${card.action}`,
    card.item && `card--item-${card.item}`,
    card.subtype && card.subtype.map(subtype => `card--subtype-${subtype}`).join(" "),
    modifiers.isBig && 'card--big',
    modifiers.isSmall && 'card--small',
  ].join(" ");

export default ({ card, onPlay, modifiers }) =>
  <div
    className={computeCardClass(card, modifiers)}
    onClick={() => {
      onPlay && onPlay(card);
    }}
  >

    <div className="card__inner">
    
    {card.item && <div className={`card__item card__item--${card.item}`} />}
    {card.subtype && card.subtype.length &&
      card.subtype.map((subtype, index) =>
        <span className="card__subtype" key={index}>{subtype}</span>
    )} 
      {card.layout && 
        <CardLayout layout={card.layout} item={card.item} />}
    </div>
  </div>;

// {
//   type: ACTION | PATH | HIDDEN
//   action: DESTROY | BLOCK | FREE, // for type === ACTION
//   subtype: [ PICKAXE | LIGHT | CHARIOT ], // for action === BLOCK | FREE
//   item: GOLD | ROCK | LADDER | EMPTY // for type === PATH
//   layout: 1 | 0 {4}
// }
