import React from "react";

export default ({ players, role }) =>
  <ul>
    {players.filter(player => player.role === role).map(player =>
      <li key={player.id}>
        <img src={player.avatarUrl} />
        <p>
          {player.name}
        </p>
      </li>
    )}
  </ul>;
