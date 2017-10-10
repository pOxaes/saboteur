import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import Button from "./Button";
import CardLayout from "./CardLayout";
import CardGold from "./CardGold";
import CardAction from "./CardAction";
import CardBackfaceSvg from "./CardBackfaceSvg";
import "../../styles/Card.css";

const computeCardClass = (card, modifiers = {}, hasEntered) =>
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
    modifiers.isSelected && "card--selected",
    hasEntered && "card--entered"
  ].join(" ");

export default class Card extends Component {
  state = {
    hasEntered: !this.props.enterAnimation
  };

  componentDidMount() {
    if (this.props.enterAnimation) {
      this.props.enterAnimation(findDOMNode(this)).then(() => {
        this.setState({
          hasEntered: true
        });
      });
    }
  }

  render() {
    const { card, onPlay, modifiers = {}, rotateLayout, discard } = this.props;
    const { hasEntered } = this.state;

    return (
      <div
        className={computeCardClass(card, modifiers, hasEntered)}
        id={`card-${card.id}`}
      >
        <div className="card--header-actions">
          {modifiers.isSelected &&
            card.canRotate &&
            <div className="card--header-actions--rotate">
              <Button
                className="card__rotate"
                type="button"
                onClick={() => {
                  rotateLayout && rotateLayout(card);
                }}
                text="rotate"
                modifiers={{
                  verySmall: true
                }}
              />
            </div>}
          {modifiers &&
            modifiers.isSelected &&
            <div className="card--header-actions--discard">
              <Button
                className="card__discard"
                type="button"
                onClick={() => {
                  discard && discard(card);
                }}
                text="discard"
                modifiers={{
                  verySmall: true
                }}
              />
            </div>}
        </div>
        <div
          className="card__inner"
          onClick={() => {
            onPlay && onPlay(card);
          }}
        >
          {(card.hidden || card.type === "HIDDEN") &&
            !card.layout &&
            <CardBackfaceSvg />}
          {card.item &&
            <div className={`card__item card__item--${card.item}`} />}
          {card.layout && <CardLayout layout={card.layout} item={card.item} />}
          {card.count && <CardGold count={card.count} />}
          {card.action &&
            <CardAction action={card.action} subtype={card.subtype} />}
        </div>
      </div>
    );
  }
}

// {
//   type: ACTION | PATH | HIDDEN | GOLD
//   action: DESTROY | BLOCK | FREE, // for type === ACTION
//   subtype: [ PICKAXE | LIGHT | CHARIOT ], // for action === BLOCK | FREE
//   item: GOLD | ROCK | LADDER | EMPTY // for type === PATH
//   layout: 1 | 0 {4}
//   count: 1-3 // for type === GOLD
// }
