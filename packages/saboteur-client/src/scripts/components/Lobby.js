import React from "react";
import gameRules from "saboteur-shared/game";

export default ({ game, startGame }) =>
  <div className="game__lobby-status">
    <p className="game__players-count">
      {game.players.length} / {game.maxPlayers} players
    </p>
    {game.players.length < gameRules.MIN_PLAYERS_COUNT &&
      <p>
        You need at least {gameRules.MIN_PLAYERS_COUNT} players to start
      </p>}
    {game._canStart &&
      <button type="button" onClick={startGame}>
        Start Game
      </button>}
  </div>;
