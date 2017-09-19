import React from "react";
import "../../styles/PlayerRole.css";

export default ({ role }) =>
  <div className="player-role">
    <div className="player-role__inner">
      {role}
    </div>
  </div>;
