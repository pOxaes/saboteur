import React from "react";
import Card from "./Card";
import "../../../node_modules/reset-css/reset.css";
import "../../styles/Player.css";

const malusToCard = subtype => ({
  type: "ACTION",
  action: "BLOCK",
  subtype: [subtype]
});

const computePlayerClass = (player, isCurrentPlayer) =>
  [
    "player",
    isCurrentPlayer ? `player--playable` : ""
  ].join(" ");

export default ({ player, kick, canKick, isCurrentPlayer, onCardPlay }) =>
  <div className={computePlayerClass(player, isCurrentPlayer)} >
    {player.name}
    {canKick &&
      <button type="button" onClick={() => kick(player)}>
        kick
      </button>}
    <div className="player__gold">
      {player.gold &&
        player.gold.map((goldValue, index) =>
          <span key={index}>
            ${goldValue}
          </span>
        )}
    </div>
    <div className="player__malus">
      {player.malus &&
        player.malus.map((malus, index) =>
          <Card card={malusToCard(malus)} key={index} />
        )}
    </div>
    <div className="player__cards">
      {player.cards &&
        player.cards.map((card, index) => (
          <div className="player__cards__card-wrapper" key={index}>
            <Card card={card} onPlay={onCardPlay} />
          </div>))}
    </div>
  </div>;
