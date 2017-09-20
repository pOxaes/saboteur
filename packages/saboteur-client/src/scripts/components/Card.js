import React from "react";
import Button from "./Button";
import CardLayout from "./CardLayout";
import CardGold from "./CardGold";
import CardAction from "./CardAction";
import "../../styles/Card.css";

const computeCardClass = (card, modifiers = {}) =>
  [
    "card",
    `card--${card.type}`,
    card.hidden && "card--HIDDEN",
    card.action && `card--action-${card.action}`,
    card.item && `card--item-${card.item}`,
    card.subtype &&
      card.subtype.map(subtype => `card--subtype-${subtype}`).join(" "),
    card.subtype && card.subtype.length > 1 && "card--multiple-subtype",
    modifiers.isHand && "card--hand",
    modifiers.isPlayer && "card--player",
    modifiers.isMalus && "card--malus",
    modifiers.isSelected && "card--selected"
  ].join(" ");

export default ({ card, onPlay, modifiers, rotateLayout, discard }) =>
  <div className={computeCardClass(card, modifiers)} id={`card-${card.id}`}>
    <div className="card--header-actions">
      {card.canRotate &&
        <div className="card--header-actions--rotate">
          <Button
            className="card__rotate"
            type="button"
            onClick={() => {
              rotateLayout && rotateLayout(card);
            }}
            text="rotate"
          />
        </div>}
      {modifiers &&
        modifiers.isSelected &&
        <div className="card--header-actions--discard">
          <button
            className="card__discard"
            type="button"
            onClick={() => {
              discard && discard(card);
            }}
          >
            discard
          </button>
        </div>}
    </div>
    <div
      className="card__inner"
      onClick={() => {
        onPlay && onPlay(card);
      }}
    >
      {card.item && <div className={`card__item card__item--${card.item}`} />}
      {card.layout && <CardLayout layout={card.layout} item={card.item} />}
      {card.count && <CardGold count={card.count} />}
      {card.action &&
        <CardAction action={card.action} subtype={card.subtype} />}
    </div>
  </div>;

// {
//   type: ACTION | PATH | HIDDEN | GOLD
//   action: DESTROY | BLOCK | FREE, // for type === ACTION
//   subtype: [ PICKAXE | LIGHT | CHARIOT ], // for action === BLOCK | FREE
//   item: GOLD | ROCK | LADDER | EMPTY // for type === PATH
//   layout: 1 | 0 {4}
//   count: 1-3 // for type === GOLD
// }
