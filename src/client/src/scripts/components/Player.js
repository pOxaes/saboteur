import React from "react";
import Card from "./Card";
import "../../../node_modules/reset-css/reset.css";
import "../../styles/Player.css";

const malusToCard = subtype => {
  return {
    type: "ACTION",
    action: "BLOCK",
    subtype
  };
};

export default ({ player, kick, canKick }) =>
  <div className="player">
    {player.name}
    {canKick &&
      <button type="button" onClick={() => kick(player)}>
        kick
      </button>}
    <div>
      gold:
      {player.gold &&
        player.gold.map((goldValue, index) =>
          <span key={index}>
            {goldValue}
          </span>
        )}
    </div>
    <div>
      malus:
      {player.malus &&
        player.malus.map((malus, index) => <Card card={malusToCard(malus)} key={index} />)}
    </div>
    <div>
      cards:
      {player.cards &&
        player.cards.map((card, index) => {
          return <Card card={card} key={index} />;
        })}
    </div>
  </div>;
