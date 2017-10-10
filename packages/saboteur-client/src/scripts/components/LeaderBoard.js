import React from "react";
import Player from "./Player";
import "../../styles/LeaderBoard.css";

export default ({ leaderBoard }) =>
  <ul className="leader-board">
    {leaderBoard.map((rankPlayers, rank) =>
      <li className="leader-board__item" key={rank}>
        <h3 className="leader-board__item__rank">
          #{rank + 1}
        </h3>
        <ul className="leader-board__item__players">
          {rankPlayers.map((player, playerIndex) =>
            <li className="leader-board__item__player" key={playerIndex}>
              <Player
                player={player}
                shouldHideCards={true}
                modifiers={{ highlight: rank === 0 }}
              />
            </li>
          )}
        </ul>
      </li>
    )}
  </ul>;
