import React from "react";
import "../../styles/PlayerAvatar.css";

const getAvatarStyle = avatar => ({
  backgroundImage: `url(${avatar})`
});

export default ({ avatar }) =>
  <div className="player-avatar">
    <div className="player-avatar__inner" style={getAvatarStyle(avatar)} />
  </div>;
