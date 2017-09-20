import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import ChatMessage from "./ChatMessage";
import "../../styles/Chat.css";

const computeChatClassName = ({ isVisible, hasNewMessage }) =>
  [
    "chat",
    isVisible && "chat--show",
    hasNewMessage && "chat--new-message"
  ].join(" ");

class Chat extends Component {
  state = {
    isVisible: true,
    hasNewMessage: false,
    togglerText: ">",
    lastMessageDate: new Date().getTime()
  };

  toggleChat = () => {
    const nextVisibleState = !this.state.isVisible;
    this.setState({
      isVisible: nextVisibleState,
      togglerText: nextVisibleState ? ">" : "<",
      hasNewMessage: nextVisibleState ? false : this.state.hasNewMessage
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.lastMessageDate - this.state.lastMessageDate > 0) {
      this.setState({
        lastMessageDate: nextProps.lastMessageDate,
        hasNewMessage: !this.state.isVisible
      });
    }
  }

  render() {
    return (
      <div className={computeChatClassName(this.state)}>
        <div className="chat__toggler">
          <Button
            onClick={this.toggleChat}
            text={this.state.togglerText}
            modifiers={{
              small: true,
              square: true,
              warning: this.state.hasNewMessage
            }}
          />
        </div>
        <div className="chat__messages">
          <ul>
            {this.props.chat.map(({ user, messages }, index) =>
              <ChatMessage
                key={index}
                user={user}
                messages={messages}
                isCurrentUser={user && user.id === this.props.currentUser}
              />
            )}
          </ul>
        </div>
        <form onSubmit={this.props.sendMessage} className="chat__form">
          <input
            className="chat__input"
            type="text"
            name="name"
            maxLength="50"
            placeholder="type your message"
            onChange={this.props.handleMessageChange}
            value={this.props.message}
            required
          />

          <Button
            className="chat__submit"
            type="submit"
            text="Send"
            modifiers={{
              small: true,
              square: true
            }}
          />
        </form>
      </div>
    );
  }
}

Chat.propTypes = {
  chat: PropTypes.array.isRequired,
  currentUser: PropTypes.any.isRequired,
  sendMessage: PropTypes.func.isRequired,
  handleMessageChange: PropTypes.func.isRequired
};

Chat.defaultProps = {
  chat: []
};

export default Chat;
