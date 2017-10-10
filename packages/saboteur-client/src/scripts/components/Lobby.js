import React from "react";
import gameRules from "saboteur-shared/dist/game";
import Button from "./Button";

export default ({ game, startGame }) =>
  <div className="game__lobby-status">
    <p className="game__players-count">
      {game.players.length} / {game.maxPlayers}
    </p>
    {game.players.length < gameRules.MIN_PLAYERS_COUNT &&
      <p className="game__players-feedback">
        You need at least {gameRules.MIN_PLAYERS_COUNT} players to start
      </p>}
    <div className="view__section view__section--dark">
      {game._canStart && <Button text="Start Game" onClick={startGame} />}
    </div>
  </div>;
