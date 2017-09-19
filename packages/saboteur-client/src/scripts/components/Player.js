import React from "react";
import Card from "./Card";
import PlayerAvatar from "./PlayerAvatar";
import PlayerMalus from "./PlayerMalus";
import PlayerGold from "./PlayerGold";
import "../../styles/Player.css";

const computePlayerClass = player =>
  ["player", player.isHighlighted && "player--highlighted"].join(" ");

export default ({ player, kick, canKick, onClick }) =>
  <div className={computePlayerClass(player)} id={`player-${player.id}`}>
    {canKick &&
      <button type="button" onClick={() => kick(player)}>
        kick
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
        <PlayerAvatar avatar={player.avatarUrl} />
        <PlayerGold gold={player.gold} />
      </div>
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
      </div>
    </div>
  </div>;
