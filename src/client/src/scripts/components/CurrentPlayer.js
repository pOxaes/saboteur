import React from "react";
import Card from "./Card";
import PlayerStatus from "./PlayerStatus";
import "../../styles/CurrentPlayer.css";

const computeCurrentPlayerClass = selectedCard =>
  ["current-player", selectedCard && "current-player--selected-card"].join(" ");

export default ({ player, onCardPlay, selectedCard, rotateCardLayout }) =>
  <div className={computeCurrentPlayerClass(selectedCard)}>
    <PlayerStatus player={player} direction="top" />
    {player.cards &&
      <div className="current-player__hand">
        {player.cards.map((card, index) =>
          <div className="current-player__hand__card-wrapper" key={index}>
            <Card
              card={card}
              onPlay={onCardPlay}
              rotateLayout={rotateCardLayout}
              modifiers={{
                isHand: true,
                isSelected: selectedCard && selectedCard.id === card.id
              }}
            />
          </div>
        )}
      </div>}
  </div>;
