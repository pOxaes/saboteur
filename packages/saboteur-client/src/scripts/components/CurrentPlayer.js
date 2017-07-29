import React from "react";
import Card from "./Card";
import PlayerStatus from "./PlayerStatus";
import PlayerRole from "./PlayerRole";
import "../../styles/CurrentPlayer.css";

const computeCurrentPlayerClass = (selectedCard, isPlaying) =>
  [
    "current-player",
    selectedCard && "current-player--selected-card",
    isPlaying && "current-player--playing"
  ].join(" ");

export default ({
  player,
  onCardPlay,
  selectedCard,
  rotateCardLayout,
  isPlaying
}) =>
  <div className={computeCurrentPlayerClass(selectedCard, isPlaying)}>
    <PlayerStatus player={player} direction="top" />
    {player.role && <PlayerRole role={player.role} />}
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
