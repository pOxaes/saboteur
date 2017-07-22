import React from "react";
import Card from "./Card";
import PlayerStatus from "./PlayerStatus";
import "../../styles/CurrentPlayer.css";

export default ({ player, onCardPlay, selectedCard }) =>
  <div className="current-player">
    <PlayerStatus player={player} direction="top"/>
    <div className="current-player__hand">
      {player.cards &&
        player.cards.map((card, index) => (
          <div className="current-player__hand__card-wrapper" key={index}>
            <Card 
              card={card} 
              onPlay={onCardPlay} 
              modifiers={{ isHand: true, isSelected: selectedCard && selectedCard.id === card.id}} />
          </div>))}
    </div>
  </div>