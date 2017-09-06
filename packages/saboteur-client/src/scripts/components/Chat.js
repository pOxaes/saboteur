import React from "react";
import "../../styles/Chat.css";

export default ({ chat, handleMessageChange, sendMessage, message }) =>
  <div className="chat">
    <ul>
      {chat.map(({ user, message }, index) =>
        <li key={index}>
          <span>
            {user.name}:
          </span>
          <span>
            {message}
          </span>
        </li>
      )}
    </ul>
    <form onSubmit={sendMessage}>
      <label>
        <input
          type="text"
          name="name"
          maxLength="50"
          placeholder="type your message"
          onChange={handleMessageChange}
          value={message}
          required
        />
      </label>

      <button className="button" type="submit">
        Send
      </button>
    </form>
  </div>;
