import React from "react";
import Card from "./Card";
import PlayerRole from "./PlayerRole";
import PlayerMalus from "./PlayerMalus";
import PlayerGold from "./PlayerGold";
import { onCardEnter } from "../animation/game.animation";
import "../../styles/CurrentPlayer.css";

const computeCurrentPlayerClass = (selectedCard, isPlaying) =>
  [
    "current-player",
    selectedCard && "current-player--selected-card",
    isPlaying && "current-player--playing"
  ].join(" ");

const computeCardWrapperClass = ({ id }) =>
  [
    "current-player__hand__card-wrapper",
    `current-player__hand__card-wrapper--${id}`
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
      className="current-player__malus"
      onClick={() => {
        selectPlayer(player);
      }}
    >
      <PlayerMalus malus={player.malus} />
    </div>
    <div className="current-player__gold">
      <PlayerGold gold={player.gold} />
    </div>
    {player.role && <PlayerRole role={player.role} />}
    {player.cards &&
      <div className="current-player__hand">
        {player.cards.map((card, index) =>
          <div
            className={computeCardWrapperClass(card)}
            index={index}
            key={card.id}
          >
            <Card
              card={card}
              onPlay={onCardPlay}
              rotateLayout={rotateCardLayout}
              enterAnimation={onCardEnter.bind(null, index)}
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
