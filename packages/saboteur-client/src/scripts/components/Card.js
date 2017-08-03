import React from "react";
import CardLayout from "./CardLayout";
import CardGold from "./CardGold";
import "../../styles/Card.css";

const computeCardClass = (card, modifiers = {}) =>
  [
    "card",
    // card.isPlayable && "card--is-playable",
    `card--${card.type}`,
    card.action && `card--action-${card.action}`,
    card.item && `card--item-${card.item}`,
    card.subtype &&
      card.subtype.map(subtype => `card--subtype-${subtype}`).join(" "),
    modifiers.isHand && "card--hand",
    modifiers.isPlayer && "card--player",
    modifiers.isMalus && "card--malus",
    modifiers.isSelected && "card--selected"
  ].join(" ");

export default ({ card, onPlay, modifiers, rotateLayout }) =>
  <div className={computeCardClass(card, modifiers)}>
    {card.canRotate &&
      <button
        className="card__rotate"
        type="button"
        onClick={() => {
          rotateLayout && rotateLayout(card);
        }}
      >
        rotate
      </button>}

    <div
      className="card__inner"
      onClick={() => {
        onPlay && onPlay(card);
      }}
    >
      {card.item && <div className={`card__item card__item--${card.item}`} />}
      {card.subtype &&
        card.subtype.length &&
        card.subtype.map((subtype, index) =>
          <span className="card__subtype" key={index}>
            {subtype}
          </span>
        )}
      {card.layout && <CardLayout layout={card.layout} item={card.item} />}
      {card.count && <CardGold count={card.count} />}
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
