import React from "react";
import Card from "./Card";
import "../../styles/LeaderBoard.css";

const goldCountToCard = count => ({
  type: "GOLD",
  count
});

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
              <div className="leader-board__item__player__name">
                {player.name}
              </div>
              {player.gold.length > 0 &&
                <div className="leader-board__item__player__gold">
                  {player.gold.map((goldCount, index) =>
                    <Card
                      card={goldCountToCard(goldCount)}
                      key={index}
                      modifiers={{ isMalus: true }}
                    />
                  )}
                </div>}
            </li>
          )}
        </ul>
      </li>
    )}
  </ul>;
