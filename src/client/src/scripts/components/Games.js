import React from "react";
import GameItem from "./GameItem";
import "../../styles/Games.css";

export default ({ games, onSelectGame }) =>
  <div className="games">
    {!games || games.length === 0
      ? <p>Empty</p>
      : <ul className="games__list">
          {games.map(game =>
            <li className="game__list__item" key={game.id}>
              <GameItem game={game} onClick={onSelectGame} />
            </li>
          )}
        </ul>}
  </div>;
