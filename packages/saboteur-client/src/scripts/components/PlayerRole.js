import React from "react";
import { teamToLabel } from "../services/game";
import "../../styles/PlayerRole.css";

export default ({ role }) =>
  <div className="player-role">
    <div className="player-role__inner">
      {teamToLabel(role)}
    </div>
  </div>;
