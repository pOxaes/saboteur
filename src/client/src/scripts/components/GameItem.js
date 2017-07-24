import React from "react";
import "../../styles/GameItem.css";

export default ({ game, onClick }) =>
  <button className="game-item" onClick={() => onClick(game)}>
    <span className="game-item__name">
      {game.name}
    </span>
    <div className="game-item__players-count">
      <span className="game-item__players-count__playing">
        {game.playersCount}
      </span>
      <span className="game-item__players-count__max">
        {game.maxPlayers && `/${game.maxPlayers}`}
      </span>
    </div>
  </button>;
