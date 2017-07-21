import React from "react";
import Card from "./Card";
import PlayerStatus from "./PlayerStatus";
import "../../styles/CurrentPlayer.css";

export default ({ player, onCardPlay }) =>
  <div className="current-player">
    <PlayerStatus player={player} />
    <div className="current-player__hand">
      {player.cards &&
        player.cards.map((card, index) => (
          <div className="current-player__hand__card-wrapper" key={index}>
            <Card card={card} onPlay={onCardPlay} modifiers={{ isHand: true }} />
          </div>))}
    </div>
  </div>