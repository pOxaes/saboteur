import React from "react";
import Player from "./Player";
import "../../styles/PlayersList.css";

const computePlayerItemClass = player =>
  [
    "player-list__item",
    `player-list__item--position-${player.position}`,
  ].join(" ");

export default ({ players, onKickPlayer, canKickPlayer, onCardPlay }) =>
  <div className="players-list">
    {players.length === 0
      ? <p>No players</p>
      : [players[0]].map(player =>
          <li className={computePlayerItemClass(player)} key={player.id}>
            <Player
              player={player}
              canKick={canKickPlayer}
              kick={onKickPlayer}
              isCurrentPlayer={player.position === "bottom"}
              onCardPlay={onCardPlay}
            />
          </li>
        )}
  </div>;
