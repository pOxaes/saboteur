import React from "react";
import Card from "./Card";
import PlayerAvatar from "./PlayerAvatar";
import PlayerMalus from "./PlayerMalus";
import PlayerGold from "./PlayerGold";
import "../../styles/Player.css";

const computePlayerClass = (player, { isLobby, highlight }) =>
  [
    "player",
    (player.isHighlighted || highlight) && "player--highlighted",
    isLobby && "player--lobby"
  ].join(" ");

export default ({
  player,
  kick,
  canKick,
  onClick,
  modifiers = {},
  shouldHideCards
}) => {
  const { isLobby } = modifiers;
  return (
    <div
      className={computePlayerClass(player, modifiers)}
      id={`player-${player.id}`}
    >
      {canKick &&
        <button
          type="button"
          className="player__kick-button button--drop"
          onClick={() => kick(player)}
        >
          <span>✕</span>
        </button>}
      <div
        className="player__inner"
        onClick={() => {
          onClick && onClick(player);
        }}
      >
        <div className="player__name">
          {player.name}
        </div>
        <div className="player__group">
          <PlayerAvatar
            avatar={player.avatarUrl}
            size={isLobby ? 100 : 50}
            modifiers={{ isBig: !!isLobby }}
          />
          {!isLobby && <PlayerGold gold={player.gold} />}
        </div>
        {!isLobby &&
          !shouldHideCards &&
          <div className="player__group player__group--cards">
            <div className="player__cards">
              {player.cards &&
                player.cards.map((card, index) =>
                  <div className="player__cards__card-wrapper" key={index}>
                    <Card card={card} modifiers={{ isPlayer: true }} />
                  </div>
                )}
            </div>
            <PlayerMalus malus={player.malus} />
          </div>}
      </div>
    </div>
  );
};
