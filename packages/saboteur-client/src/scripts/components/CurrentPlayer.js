import React from "react";
import Card from "./Card";
import PlayerRole from "./PlayerRole";
import PlayerMalus from "./PlayerMalus";
import PlayerGold from "./PlayerGold";
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
  selectPlayer,
  rotateCardLayout,
  discardCard,
  isPlaying
}) =>
  <div
    className={computeCurrentPlayerClass(selectedCard, isPlaying)}
    id={`player-${player.id}`}
  >
    <div
      className="current-player__head"
      onClick={() => {
        selectPlayer(player);
      }}
    >
      <PlayerGold gold={player.gold} />
      <PlayerMalus malus={player.malus} />
    </div>
    {player.role && <PlayerRole role={player.role} />}
    {player.cards &&
      <div className="current-player__hand">
        {player.cards.map((card, index) =>
          <div className="current-player__hand__card-wrapper" key={index}>
            <Card
              card={card}
              onPlay={onCardPlay}
              rotateLayout={rotateCardLayout}
              discard={discardCard}
              modifiers={{
                isHand: true,
                isSelected: selectedCard && selectedCard.id === card.id
              }}
            />
          </div>
        )}
      </div>}
  </div>;
