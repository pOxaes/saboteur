import React from "react";
import Card from "./Card";
import "../../styles/PlayerStatus.css";

const malusToCard = subtype => ({
  type: "ACTION",
  action: "BLOCK",
  subtype: [subtype]
});

export default ({ player }) =>
  <div className="player-status">
    <div className="player-status__gold">
      {player.gold &&
        player.gold.map((goldValue, index) =>
          <span key={index}>
            ${goldValue}
          </span>
        )}
    </div>
    <div className="player-status__name">
      {player.name}
    </div>
    <div className="player-status__malus">
      {player.malus &&
        player.malus.map((malus, index) =>
          <Card card={malusToCard(malus)} key={index} modifiers={{ isMalus: true }}/>
        )}
    </div>
  </div>