import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { Redirect, Link } from "react-router-dom";
import boardRules from "saboteur-shared/dist/board";
import gameRules from "saboteur-shared/dist/game";
import events from "saboteur-shared/dist/events";
import actions from "../store/actions";
import gameService from "../services/game";
import EventsQueue from "../services/eventsQueue";
import PlayersList from "../components/PlayersList";
import CurrentPlayer from "../components/CurrentPlayer";
import Lobby from "../components/Lobby";
import RoundEnd from "../components/RoundEnd";
import DoubleColorTitle from "../components/DoubleColorTitle";
import PlayingGame from "../components/PlayingGame";
import Chat from "../components/Chat";
import Button from "../components/Button";
import gameAnimation from "../animation/game.animation";
import "../../styles/Game.css";

const REVEAL_DURATION = 5000;

const MAX_MESSAGES_COUNT = 50;

function filterMessages(game) {
  let messagesCount = 0;
  let filteredMessages = [];
  for (let i = game.chat.length - 1; i >= 0; i--) {
    let chatEl = game.chat[i];

    if (!chatEl.user) {
      filteredMessages.push(chatEl);
    } else if (messagesCount < MAX_MESSAGES_COUNT) {
      const leftMessages = MAX_MESSAGES_COUNT - messagesCount;
      chatEl.messages = chatEl.messages.slice(
        chatEl.messages.length - leftMessages,
        chatEl.messages.length
      );
      messagesCount += chatEl.messages.length;
      filteredMessages.push(chatEl);
    }
  }

  filteredMessages.reverse();

  return filteredMessages;
}

const computeGameClass = (game, selectedCard, currentPlayer) =>
  [
    "view__wrapper",
    "game",
    selectedCard && "game--selected-card",
    game && `game--status-${game.status}`,
    game &&
      currentPlayer &&
      game.currentPlayerId === currentPlayer.id &&
      "game--current-player-turn",
    game &&
      currentPlayer &&
      currentPlayer.malus &&
      currentPlayer.malus.length &&
      "game--current-player-malus"
  ].join(" ");

export class Game extends Component {
  state = {
    eventsInitialized: false,
    id: this.props.match.params.id,
    message: "",
    lastMessageDate: new Date().getTime()
  };

  queue = new EventsQueue();

  componentDidMount() {
    actions
      .getGame(this.state.id)
      .then(this.updateGame.bind(this))
      .catch(err => {
        this.props.history.replace("/");
      });
    this.initEvents(this.props.ws);
  }

  componentWillReceiveProps({ ws }) {
    this.initEvents(ws);
  }

  initEvents(ws) {
    if (!ws || this.state.eventsInitialized) {
      return;
    }
    this.setState({
      eventsInitialized: true
    });
    ws.on(events.SEND_MESSAGE, this.checkGame.bind(this, "addMessage"));
    ws.on(events.JOIN_GAME, this.checkGame.bind(this, "addPlayer"));
    ws.on(events.LEAVE_GAME, this.checkGame.bind(this, "removePlayer"));
    ws.on(events.START_GAME, this.checkGame.bind(this, "onGameStart"));
    ws.on(events.PLAY_CARD, this.checkGame.bind(this, "playCard"));
    ws.on(events.ROUND_END, this.checkGame.bind(this, "endRound"));
    ws.on(events.DRAW_CARD, this.checkGame.bind(this, "drawCard"));
    ws.on(events.DELETE_GAME, this.checkGame.bind(this, "deleteGame"));
    ws.on(events.REVEAL_CARD, this.checkGame.bind(this, "revealCard"));
    ws.on(
      events.REVEAL_CARD_PERMANENTLY,
      this.checkGame.bind(this, "revealCardPermanently")
    );
    ws.on(
      events.CURRENT_PLAYER_UPDATE,
      this.checkGame.bind(this, "updateCurrentPlayer")
    );
  }

  componentWillUnmount() {
    this.props.ws.removeListener(events.SEND_MESSAGE);
    this.props.ws.removeListener(events.JOIN_GAME);
    this.props.ws.removeListener(events.LEAVE_GAME);
    this.props.ws.removeListener(events.START_GAME);
    this.props.ws.removeListener(events.PLAY_CARD);
    this.props.ws.removeListener(events.ROUND_END);
    this.props.ws.removeListener(events.DRAW_CARD);
    this.props.ws.removeListener(events.DELETE_GAME);
    this.props.ws.removeListener(events.REVEAL_CARD);
    this.props.ws.removeListener(events.CURRENT_PLAYER_UPDATE);
  }

  checkGame(action, payload) {
    if (payload.gameId !== this.state.id) {
      return;
    }
    this.queue.queue({
      action: this[action].bind(this),
      payload
    });
  }

  revealCard({ slot }) {
    const matchingSlot = this.state.slots.find(
      boardSlot => boardSlot.x === slot.x && boardSlot.y === slot.y
    );
    matchingSlot.card = slot.card;

    setTimeout(() => {
      matchingSlot.card.layout = undefined;
      matchingSlot.card.item = undefined;
      this.forceUpdate();
    }, REVEAL_DURATION);
  }

  async revealCardPermanently({ x, y, hidden, item, layout }) {
    const updatedGame = this.state.game;
    const matchingSlot = updatedGame.board.find(
      boardSlot => boardSlot.x === x && boardSlot.y === y
    );
    const timeout = item === "GOLD" ? 3000 : 0;
    Object.assign(matchingSlot, {
      hidden,
      item,
      layout
    });
    this.updateGame(updatedGame);
    // TODO: animate
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  deleteGame(gameId) {
    this.props.history.replace("/");
  }

  getPlayer(playerId) {
    const isCurrentPlayer = playerId === this.state.currentPlayer.id;
    const player = isCurrentPlayer
      ? this.state.currentPlayer
      : this.state.players.find(player => player.id === playerId);
    return {
      isCurrentPlayer,
      player
    };
  }

  drawCard({ card, playerId, deck }) {
    this.setState({
      game: Object.assign(this.state.game, { deck })
    });
    if (playerId !== this.props.user.id) {
      return;
    }
    const user = this.getPlayer(playerId);
    if (card.type === "PATH") {
      boardRules.formatCardLayout(card);
      card.canRotate = gameService.canRotate(card.layout);
    }
    user.player.cards.push(card);
  }

  updateCurrentPlayer({ currentPlayerId }) {
    const updatedGame = this.state.game;
    updatedGame.currentPlayerId = currentPlayerId;
    this.setState({
      game: updatedGame
    });
  }

  endRound({ game }) {
    this.updateGame(game);
  }

  addMessage(chatItem) {
    const updatedGame = this.state.game;

    if (!updatedGame) {
      return;
    }
    updatedGame.chat = filterMessages(updatedGame);

    const lastMessage = updatedGame.chat[updatedGame.chat.length - 1];

    if (
      lastMessage &&
      lastMessage.user &&
      chatItem.user &&
      lastMessage.user.id === chatItem.user.id
    ) {
      lastMessage.messages = chatItem.messages;
    } else {
      updatedGame.chat.push(chatItem);
    }
    this.setState({ game: updatedGame, lastMessageDate: new Date().getTime() });
    this.forceUpdate();
  }

  async playCard({ playedCard, destination, playerId }) {
    // update playing player
    const playingUser = this.getPlayer(playerId);
    const card = playingUser.player.cards.find(
      card => card.id === playedCard.id
    );

    if (destination.type === "DISCARD") {
      if (playingUser.isCurrentPlayer) {
        await gameAnimation.discardForCurrentUser(
          findDOMNode(this),
          playedCard.id,
          playerId
        );
      } else {
        await gameAnimation.discard(findDOMNode(this), playedCard.id, playerId);
      }
    }

    console.log(playedCard);

    let animationData = {
      destination: {
        type: destination.type,
        data: {}
      },
      card: {
        id: playedCard.id
      }
    };

    if (destination.type === "PLAYER") {
      // update target player
      const destUser = this.getPlayer(destination.id);
      animationData.destination.data = {
        isCurrentPlayer: destUser.isCurrentPlayer,
        id: destination.id
      };
      if (playedCard.action === "BLOCK") {
        destUser.player.malus = playedCard.subtype;
      } else if (playedCard.action === "FREE") {
        destUser.player.malus = [];
      }
      if (destUser.isCurrentPlayer) {
        this.setState({ currentPlayer: destUser.player });
      } else {
        this.setState({ players: this.state.players });
      }
      await gameAnimation.moveCard(findDOMNode(this), animationData, playerId);
    } else if (destination.type === "SLOT") {
      animationData.destination.data = {
        x: destination.x,
        y: destination.y
      };
      await gameAnimation.moveCard(findDOMNode(this), animationData, playerId);
      const updatedGame = this.state.game;
      if (playedCard.action === "DESTROY") {
        updatedGame.board = updatedGame.board.filter(
          slot => slot.x !== destination.x || slot.y !== destination.y
        );
      } else if (playedCard.type === "PATH") {
        playedCard.x = destination.x;
        playedCard.y = destination.y;
        updatedGame.board.push(playedCard);
      }
      this.updateGame(updatedGame);
    }

    // remove card from player
    if (card) {
      playingUser.player.cards = playingUser.player.cards.filter(
        card => card.id !== playedCard.id
      );
    } else if (this.state.game.deck === 0) {
      playingUser.player.cards.shift();
    }

    if (playingUser.isCurrentPlayer) {
      this.setState({ currentPlayer: playingUser.player });
    } else {
      this.setState({ players: this.state.players });
    }

    // with animation, add:
    // - discard
  }

  addPlayer(player) {
    if (player.id === this.props.user.id) {
      return;
    }
    const updatedGame = this.state.game;
    updatedGame.players.push(player);
    if (
      updatedGame.creator === this.props.user.id &&
      updatedGame.players.length >= gameRules.MIN_PLAYERS_COUNT
    ) {
      updatedGame._canStart = true;
    }
    this.updateGame(updatedGame);
  }

  removePlayer({ playerId }) {
    if (playerId === this.props.user.id) {
      this.props.history.replace("/");
      return;
    }
    if (playerId === this.state.game.creator) {
      actions.getGame(this.state.game.id).then(this.updateGame.bind(this));
    } else {
      const updatedGame = this.state.game;
      updatedGame.players = updatedGame.players.filter(
        player => player.id !== playerId
      );
      this.setState({
        game: updatedGame
      });
      this.updateGame(updatedGame);
    }
  }

  onGameStart({ game }) {
    this.updateGame(game);
  }

  updateGame(game) {
    if (
      game.status === gameRules.STATUSES.COMPLETED ||
      game.status === gameRules.STATUSES.ROUND_END
    ) {
      this.setState({
        game,
        slots: undefined,
        currentPlayer: undefined,
        players: undefined
      });
      return;
    }

    let slots = [];

    const currentPlayerIndex = gameService.getCurrentPlayerIndex(
      game.players,
      this.props.user.id
    );

    if (game.status === gameRules.STATUSES.PLAYING) {
      // TODO: refacto
      slots = gameService.format(game, currentPlayerIndex).slots;
    }

    this.setState({
      game,
      slots,
      currentPlayer: game.players[currentPlayerIndex],
      players:
        game.status === gameRules.STATUSES.WAITING_FOR_PLAYERS
          ? game.players
          : gameService.shiftPlayers(game.players, currentPlayerIndex)
    });
  }

  kickPlayer = player => {
    actions.kick({ playerId: player.id, gameId: this.state.id });
  };

  onCardPlay(card) {
    if (this.state.game.currentPlayerId !== this.props.user.id) {
      return;
    }

    if (card === this.state.selectedCard) {
      this.reinitSelectedCard();
      return;
    }

    this.setState({
      selectedCard: card
    });

    this.updateHighlights(card);
  }

  reinitSelectedCard() {
    this.setState({
      selectedCard: undefined
    });
    this.state.slots.concat(this.state.players).forEach(item => {
      item.isHighlighted = false;
    });
  }

  confirmSelectedCardDestination(type, destinationItem) {
    if (
      !gameService.canPlay({
        selectedCard: this.state.selectedCard,
        type,
        destinationItem,
        userId: this.props.user.id
      })
    ) {
      return;
    }

    const destination = {
      type
    };

    if (type === gameRules.DESTINATION_TYPES.PLAYER) {
      destination.id = destinationItem.id;
    }

    if (type === gameRules.DESTINATION_TYPES.SLOT) {
      destination.x = destinationItem.x;
      destination.y = destinationItem.y;
    }

    actions
      .playCard({
        gameId: this.state.id,
        cardId: this.state.selectedCard.id,
        isRotated: this.state.selectedCard.isRotated,
        destination
      })
      .catch(message => {
        console.error(message);
      });
    this.reinitSelectedCard();
  }

  updateHighlights(card) {
    this.state.slots.forEach(slot => {
      slot.isHighlighted = boardRules.canPlayCardOnSlot(
        card,
        slot,
        this.state.currentPlayer
      );
      if (slot.x === 7 && slot.y === 0) {
        console.log(card, slot, slot.isHighlighted);
      }
    });

    this.state.players.forEach(player => {
      player.isHighlighted = boardRules.canPlayCardOnPlayer(card, player);
    });
  }

  startGame() {
    actions.startGame(this.state.game.id);
  }

  renderByStatus() {
    switch (this.state.game.status) {
      case gameRules.STATUSES.WAITING_FOR_PLAYERS:
        return (
          <Lobby game={this.state.game} startGame={this.startGame.bind(this)} />
        );
      case gameRules.STATUSES.PLAYING:
        return (
          <PlayingGame
            hasSelectedCard={!!this.state.selectedCard}
            game={this.state.game}
            slots={this.state.slots}
            confirmSelectedCardDestination={this.confirmSelectedCardDestination.bind(
              this
            )}
          />
        );
      case gameRules.STATUSES.COMPLETED:
      case gameRules.STATUSES.ROUND_END:
        return (
          <RoundEnd
            game={this.state.game}
            leaderBoard={this.state.leaderBoard}
            startGame={this.startGame.bind(this)}
          />
        );

      default:
        return <Redirect to="/" />;
    }
  }

  rotateCardLayout(card) {
    boardRules.rotateCardLayout(card);
    if (this.state.selectedCard && card.id === this.state.selectedCard.id) {
      this.updateHighlights(card);
    }
    this.forceUpdate();
  }

  discardCard(card) {
    actions
      .playCard({
        gameId: this.state.id,
        cardId: card.id,
        isRotated: card.isRotated,
        destination: {
          type: "DISCARD"
        }
      })
      .catch(message => {
        console.error(message);
      });
    this.reinitSelectedCard();
  }

  leave() {
    const confirmationSentence =
      this.state.game.hostId === this.state.currentPlayer.id
        ? "Watchout, you'll be removed from this game and won't be its host anymore"
        : "Watchout, you'll be removed from this game";

    const shouldLeave = window.confirm(confirmationSentence);

    if (!shouldLeave) {
      return;
    }

    actions.leaveGame(this.state.game.id);
  }

  handleMessageChange = event => {
    this.setState({ message: event.target.value });
  };

  sendMessage = event => {
    event.preventDefault();
    actions.sendMessage({
      message: this.state.message,
      gameId: this.state.game.id
    });
    this.setState({
      message: ""
    });
  };

  render() {
    return (
      <div
        className={computeGameClass(
          this.state.game,
          this.state.selectedCard,
          this.state.currentPlayer
        )}
      >
        {this.state.game &&
          this.state.game.status !== gameRules.STATUSES.PLAYING &&
          <div>
            <h1 className="view__title">
              <DoubleColorTitle text={this.state.game.name} />
              {this.state.game.status === gameRules.STATUSES.ROUND_END &&
                <span className="view__title__caption">
                  Round #{this.state.game.currentRound}
                </span>}
            </h1>
            <Link className="game__nav__back-button link" to="/">
              Home
            </Link>
          </div>}

        {this.state.game &&
          this.state.game.status === gameRules.STATUSES.WAITING_FOR_PLAYERS &&
          <div className="game__nav__leave-button">
            <Button
              text="Leave"
              modifiers={{ warning: true, small: true }}
              onClick={() => {
                this.leave();
              }}
            />
          </div>}
        {this.state.players &&
          <PlayersList
            modifiers={{
              isLobby:
                this.state.game.status ===
                gameRules.STATUSES.WAITING_FOR_PLAYERS
            }}
            players={this.state.players}
            maxPlayers={this.state.game.maxPlayers}
            onKickPlayer={this.kickPlayer}
            currentUser={this.props.user.id}
            canKickPlayer={this.state.game._canKick}
            playingId={this.state.game.currentPlayerId}
            selectPlayer={this.confirmSelectedCardDestination.bind(
              this,
              gameRules.DESTINATION_TYPES.PLAYER
            )}
          />}
        {this.state.game && this.renderByStatus()}

        <div className="game__bottom-wrapper">
          {this.state.game &&
            this.state.game.status !== gameRules.STATUSES.WAITING_FOR_PLAYERS &&
            this.state.currentPlayer &&
            <CurrentPlayer
              player={this.state.currentPlayer}
              onCardPlay={this.onCardPlay.bind(this)}
              selectPlayer={this.confirmSelectedCardDestination.bind(
                this,
                gameRules.DESTINATION_TYPES.PLAYER
              )}
              selectedCard={this.state.selectedCard}
              isPlaying={this.state.game.currentPlayerId === this.props.user.id}
              discardCard={this.discardCard.bind(this)}
              rotateCardLayout={this.rotateCardLayout.bind(this)}
            />}
          {this.state.game &&
            this.props.user &&
            <Chat
              currentUser={this.props.user.id}
              lastMessageDate={this.state.lastMessageDate}
              chat={this.state.game.chat}
              handleMessageChange={this.handleMessageChange}
              sendMessage={this.sendMessage}
              message={this.state.message}
              modifiers={{
                affixed: this.state.game.status !== gameRules.STATUSES.PLAYING
              }}
            />}
        </div>
      </div>
    );
  }
}

export default Game;
