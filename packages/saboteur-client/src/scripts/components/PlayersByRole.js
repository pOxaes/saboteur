import React from "react";

export default ({ players, playerRole }) =>
  <ul>
    {players.filter(player => player.role === playerRole).map(player =>
      <li key={player.id}>
        <img src={player.avatarUrl} alt={player.name} />
        <p>
          {player.name}
        </p>
      </li>
    )}
  </ul>;
