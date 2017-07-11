import React from "react";
import Player from "./Player";
import "../../styles/PlayersList.css";

export default ({ players, onKickPlayer, canKickPlayer }) =>
  <div className="players-list">
    {players.length === 0
      ? <p>No players</p>
      : players.map(player =>
          <li className="player" key={player.id}>
            <Player
              player={player}
              canKick={canKickPlayer}
              kick={onKickPlayer}
            />
          </li>
        )}
  </div>;
