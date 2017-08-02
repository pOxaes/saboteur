import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import boardRules from "saboteur-shared/board";
import gameRules from "saboteur-shared/game";
import events from "saboteur-shared/events";
import actions from "../store/actions";
import gameService from "../services/game";
import EventsQueue from "../services/eventsQueue";
import PlayersList from "../components/PlayersList";
import CurrentPlayer from "../components/CurrentPlayer";
import Lobby from "../components/Lobby";
import RoundEnd from "../components/RoundEnd";
import PlayingGame from "../components/PlayingGame";
import "../../styles/Game.css";

const computeGameClass = (game, selectedCard) =>
  [
    "game",
    selectedCard && "game--selected-card",
    game && `game--status-${game.status}`
  ].join(" ");

export class Game extends Component {
  state = {
    eventsInitialized: false,
    id: this.props.match.params.id
  };

  queue = new EventsQueue();

  componentDidMount() {
    actions.getGame(this.state.id).then(this.updateGame.bind(this));
    this.initEvents(this.props.ws);
  }

  componentWillUnmount() {
    this.props.ws.removeListener(events.JOIN_GAME);
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
    ws.on(events.JOIN_GAME, this.checkGame.bind(this, "addPlayer"));
    ws.on(events.LEAVE_GAME, this.checkGame.bind(this, "removePlayer"));
    ws.on(events.START_GAME, this.checkGame.bind(this, "onGameStart"));
    ws.on(events.PLAY_CARD, this.checkGame.bind(this, "playCard"));
    ws.on(events.TURN_END, this.checkGame.bind(this, "endTurn"));
    ws.on(events.DRAW_CARD, this.checkGame.bind(this, "drawCard"));
    ws.on(
      events.CURRENT_PLAYER_UPDATE,
      this.checkGame.bind(this, "updateCurrentPlayer")
    );
  }

  checkGame(action, payload) {
    if (payload.gameId !== this.state.id) {
      return;
    }
    console.log(action);

    this.queue.queue({
      action: this[action].bind(this),
      payload
    });
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

  drawCard({ card, playerId }) {
    const user = this.getPlayer(playerId);
    if (card.type === "PATH") {
      boardRules.formatCardLayout(card);
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

  endTurn({ game }) {
    console.log("endTurn");
  }

  playCard({ playedCard, destination, playerId }) {
    // update playing player
    const playingUser = this.getPlayer(playerId);
    const card = playingUser.player.cards.find(
      card => card.id === playedCard.id
    );

    // remove card from player
    if (card) {
      playingUser.player.cards = playingUser.player.cards.filter(
        card => card.id !== playedCard.id
      );
    } else {
      playingUser.player.cards.shift();
    }
    if (playingUser.isCurrentPlayer) {
      this.setState({ currentPlayer: playingUser.player });
    } else {
      this.setState({ players: this.state.players });
    }

    if (destination.type === "PLAYER") {
      // update target player
      const destUser = this.getPlayer(destination.id);
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
    } else if (destination.type === "SLOT") {
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

    // with animation, add:
    // - discard
  }

  addPlayer(player) {
    this.state.game.players.push(player);
    this.updateGame(this.state.game);
  }

  removePlayer({ playerId }) {
    if (playerId === this.props.user.id) {
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
        game
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
      players: game.players.filter(
        (player, index) => index !== currentPlayerIndex
      )
    });
  }

  kickPlayer = player => {
    actions.kick({ playerId: player.id, gameId: this.state.id });
  };

  onCardPlay(card) {
    if (
      !card.isPlayable ||
      this.state.game.currentPlayerId !== this.props.user.id
    ) {
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

    actions.playCard({
      gameId: this.state.id,
      cardId: this.state.selectedCard.id,
      isRotated: this.state.selectedCard.isRotated,
      destination
    });
    this.reinitSelectedCard();
  }

  updateHighlights(card) {
    this.state.slots.forEach(slot => {
      slot.isHighlighted = boardRules.canPlayCardOnSlot(card, slot);
    });

    this.state.players.forEach(player => {
      player.isHighlighted = boardRules.canPlayCardOnPlayer(card, player);
    });
  }

  startGame() {
    actions.startGame(this.state.game.id).then(this.updateGame.bind(this));
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

  leave() {
    const confirmationSentence =
      this.state.game.hostId === this.state.currentPlayer.id
        ? "Watchout, you'll be removed from this game and won't be its host anymore"
        : "Watchout, you'll be removed from this game";

    const shouldLeave = window.confirm(confirmationSentence);

    if (!shouldLeave) {
      return;
    }

    actions.leaveGame(this.state.game.id).then(() => {
      this.props.history.replace("/");
    });
  }

  render() {
    return (
      <div
        className={computeGameClass(this.state.game, this.state.selectedCard)}
      >
        <div className="game__nav">
          {this.state.game &&
            this.state.game.status === gameRules.STATUSES.WAITING_FOR_PLAYERS &&
            <button
              type="button"
              className="game__nav__leave-button"
              onClick={() => {
                this.leave();
              }}
            >
              Leave
            </button>}
          <Link className="game__nav__back-button" to="/">
            Home
          </Link>
        </div>
        {this.state.players &&
          <PlayersList
            players={this.state.players}
            onKickPlayer={this.kickPlayer}
            canKickPlayer={this.state.game._canKick}
            playingId={this.state.game.currentPlayerId}
            selectPlayer={this.confirmSelectedCardDestination.bind(
              this,
              gameRules.DESTINATION_TYPES.PLAYER
            )}
          />}
        {this.state.currentPlayer &&
          <CurrentPlayer
            player={this.state.currentPlayer}
            onCardPlay={this.onCardPlay.bind(this)}
            selectPlayer={this.confirmSelectedCardDestination.bind(
              this,
              gameRules.DESTINATION_TYPES.PLAYER
            )}
            selectedCard={this.state.selectedCard}
            isPlaying={this.state.game.currentPlayerId === this.props.user.id}
            rotateCardLayout={this.rotateCardLayout.bind(this)}
          />}
        {this.state.game && this.renderByStatus()}
      </div>
    );
  }
}

export default Game;
