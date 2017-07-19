import React from "react";
import Card from "./Card";
import "../../styles/Deck.css";

const computeDeckClass = count =>
  [
    "deck",
    count === 0 ? "deck--empty" : "",
  ].join(" ");

const emptyCard = {
  type: "HIDDEN",
};

const lastThreeCards = (count) => {
  const finalTemplate = [];
  for (let i = 0, extraCards = Math.min(count, 3); i < extraCards; i++) {
    finalTemplate.push(<div className="deck__card" key={i}><Card card={emptyCard} /></div>);
  }
  return finalTemplate;
}

export default ({ count }) =>
  <div className={computeDeckClass(count)}>
    <div className="deck__cards">
      {lastThreeCards(count)}
    </div>
  </div>