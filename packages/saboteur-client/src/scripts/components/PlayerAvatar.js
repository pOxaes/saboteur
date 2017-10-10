import React from "react";
import "../../styles/PlayerAvatar.css";

function getAvatarStyle(avatar, size) {
  return {
    backgroundImage: `url(${avatar})`
  };
}

function computeAvatarClassName({ isBig, hasPlainBackground }) {
  return [
    "player-avatar",
    isBig && "player-avatar--big",
    hasPlainBackground && "player-avatar--plain-background"
  ].join(" ");
}

export default ({ avatar, size = 50, modifiers = {} }) =>
  <div className={computeAvatarClassName(modifiers)}>
    <div
      className="player-avatar__inner"
      style={getAvatarStyle(`${avatar}?sz=${size}`)}
    />
  </div>;
