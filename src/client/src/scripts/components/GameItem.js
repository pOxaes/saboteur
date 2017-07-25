import React from "react";
import { Link } from "react-router-dom";
import "../../styles/GameItem.css";

export default ({ game, onDeleteClick }) =>
  <div className="game-item">
    <Link className="game-item__link" to={`/games/${game.id}`}>
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
    </Link>
    {game._canDelete &&
      <button
        type="button"
        className="game-item__remove-button"
        onClick={() => {
          onDeleteClick && onDeleteClick(game.id);
        }}
      >
        {" "}Remove{" "}
      </button>}
  </div>;
