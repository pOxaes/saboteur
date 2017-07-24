import React from "react";
import "../../styles/GameItem.css";

export default ({ game, onDeleteClick }) =>
  <div className="game-item">
    <a className="game-item__link" href={`/games/${game.id}`}>
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
    </a>
    { game._canDelete &&
      <button type="button" className="game-item__remove-button" onClick={() => {
        onDeleteClick && onDeleteClick(game.id);
      }} > Remove </button>
    }
  </div>
