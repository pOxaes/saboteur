import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import "../../styles/GameItem.css";

export default ({ game, onDeleteClick }) =>
  <div className="game-item">
    <div className="game-item__joined">
      {game._hasJoined && "✔"}
    </div>
    <div className="game-item__name">
      {game.name}
    </div>
    <div className="game-item__players-count">
      {game.players.length} {game.maxPlayers && `/ ${game.maxPlayers}`}
    </div>
    <Link className="game-item__link" to={`/games/${game.id}`}>
      <Button text=">" modifiers={{ small: true, square: true }} />
    </Link>
    {game._canDelete &&
      <button
        type="button"
        className="game-item__remove-button button--drop"
        onClick={() => {
          onDeleteClick && onDeleteClick(game.id);
        }}
      >
        <span>✕</span>
      </button>}
  </div>;
