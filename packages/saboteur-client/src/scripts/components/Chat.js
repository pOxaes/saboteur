import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import ChatMessage from "./ChatMessage";
import "../../styles/Chat.css";

const computeChatClassName = ({ isVisible, hasNewMessage }, { affixed }) =>
  [
    "chat",
    isVisible && "chat--show",
    hasNewMessage && "chat--new-message",
    affixed && "chat--affixed"
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

  scrollToBottom() {
    const chatContainer = ReactDOM.findDOMNode(this.messagesContainer);
    const chatMessages = ReactDOM.findDOMNode(this.messages);
    const rect = chatMessages.getBoundingClientRect();
    chatContainer.scrollTop = rect.height;
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  render() {
    const {
      currentUser,
      modifiers = {},
      chat,
      sendMessage,
      handleMessageChange,
      message
    } = this.props;

    return (
      <div className={computeChatClassName(this.state, modifiers)}>
        <div className="chat__toggler">
          <button
            type="button"
            className="chat__toggler__button"
            onClick={this.toggleChat}
          >
            <span>></span>
          </button>
        </div>
        <div
          className="chat__messages"
          ref={el => {
            this.messagesContainer = el;
          }}
        >
          <ul
            ref={el => {
              this.messages = el;
            }}
          >
            {chat.map(({ user, messages }, index) =>
              <ChatMessage
                key={index}
                user={user}
                messages={messages}
                isCurrentUser={user && user.id === currentUser}
              />
            )}
          </ul>
        </div>
        <form onSubmit={sendMessage} className="chat__form">
          <input
            className="chat__input"
            type="text"
            name="name"
            maxLength="50"
            placeholder="type your message"
            onChange={handleMessageChange}
            value={message}
            required
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
