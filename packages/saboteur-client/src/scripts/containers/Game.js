import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import boardRules from "saboteur-shared/board";
import gameRules from "saboteur-shared/game";
import events from "saboteur-shared/events";
import actions from "../store/actions";
import gameService from "../services/game";
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
    ws.on(events.JOIN_GAME, this.checkGame.bind(this, "onAddPlayer"));
    ws.on(events.LEAVE_GAME, this.checkGame.bind(this, "onRemovePlayer"));
    ws.on(events.START_GAME, this.checkGame.bind(this, "onStartGame"));
  }

  checkGame(action, payload) {
    if (payload.gameId !== this.state.id) {
      return;
    }
    this[action](payload);
  }

  onAddPlayer(player) {
    this.state.game.players.push(player);
    this.updateGame(this.state.game);
  }

  onRemovePlayer({ playerId }) {
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

  onStartGame({ game }) {
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
      this.setState({
        selectedCard: undefined
      });
      this.state.slots.concat(this.state.players).forEach(item => {
        item.isHighlighted = false;
      });
      return;
    }

    this.setState({
      selectedCard: card
    });

    this.updateHighlights(card);
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
