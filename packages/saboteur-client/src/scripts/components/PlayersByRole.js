import React from "react";
import PlayersList from "./PlayersList";

export default ({ players, playerRole, shouldHighlight }) =>
  <PlayersList
    players={players.filter(player => player.role === playerRole)}
    modifiers={{ isLeaderBoard: true, highlight: shouldHighlight }}
  />;
