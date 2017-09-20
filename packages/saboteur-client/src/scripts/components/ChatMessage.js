import React from "react";
import PlayerAvatar from "./PlayerAvatar";

const computeMessageClass = (user, isCurrentUser) =>
  [
    "chat__message",
    !user && "chat__message--info",
    isCurrentUser && "chat__message--current-user"
  ].join(" ");

export default ({ user, messages, isCurrentUser }) =>
  <li className={computeMessageClass(user, isCurrentUser)}>
    {!isCurrentUser && user && <PlayerAvatar avatar={user.avatarUrl} />}
    <div className="chat__message__content">
      {!isCurrentUser &&
        user &&
        user.name &&
        <span className="chat__message__user__name">
          {user.name}
        </span>}
      <div className="chat__message__texts">
        {messages.map((message, index) =>
          <span key={index} className="chat__message__text">
            {message}
          </span>
        )}
      </div>
    </div>
  </li>;
