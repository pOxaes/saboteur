import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import userService from "../services/user";
import request from "../services/request";
import boardService from "../services/board";
import PlayersList from "../components/PlayersList";
import CurrentPlayer from "../components/CurrentPlayer";
import Board from "../components/Board";
import Deck from "../components/Deck";

const GAME_STATUS = {
  WAITING_FOR_PLAYERS: "WAITING_FOR_PLAYERS",
  PLAYING: "PLAYING"
};

const attachLinkedToStart = (card, index, cards) => {
  card.isLinkedToStart = boardService.isLinkedToStart(card, cards);
};

export class Home extends Component {
  state = {
    id: this.props.match.params.gameId,
    user: userService.get()
  };

  componentWillMount() {
    request.get(`http://localhost:3008/games/${this.state.id}`).then(this.updateGame.bind(this));
  }

  updateGame(game) {
    game.board.forEach(boardService.formatCardLayout);
    game.board.forEach(attachLinkedToStart);

    const slots = boardService.createSlotsFromCards(game.board);

    // format current player cards
    const currentPlayerIndex = game.players.map(player => player.id).indexOf(this.state.user.id);
    game.players[currentPlayerIndex].cards.forEach(card => {
      if (card.layout) {
        card.canRotate = true;
        card.isRotated = false;
      }
      boardService.formatCardLayout(card);
      boardService.attachPlayability(card, slots, game.players);
    });

    this.setState({
      game,
      slots,
      currentPlayer: game.players[currentPlayerIndex],
      players: game.players.filter((player, index) => index !== currentPlayerIndex),
    });
  }

  isLobby() {
    return (
      this.state.game &&
      this.state.game.status === GAME_STATUS.WAITING_FOR_PLAYERS
    );
  }

  kickPlayer = player => {
    // TODO: kick player
    console.log("kick", player, this.state.id);
  }

  onCardPlay = card => {
    // TODO: on card play
    if (!card.isPlayable) {
      return;
    }

    if (card === this.state.selectedCard) {
      this.setState({
        selectedCard: undefined,
      });
      this.state.slots.concat(this.state.players).forEach(item => {
        item.isHighlighted = false;
      });
      return;
    }

    // TODO: maybe just change to 
    // card.isSelected = true
    this.setState({
      selectedCard: card,
    });

    this.state.slots.forEach(slot => {
      slot.isHighlighted = boardService.canPlayCardOnSlot(card, slot);
    });

    this.state.players.forEach(player => {
      player.isHighlighted = boardService.canPlayCardOnPlayer(card, player);
    });
  }

  renderLobby() {
    return (
      <p>Lobby</p>
    );
  }

  renderPlayingGame() {
    return (
      <div>
        <Board slots={this.state.slots} selectedCard={this.state.selectedCard} />
        <Deck count={this.state.game.deck} />
      </div>
    );
  }

  renderByStatus() {
    switch (this.state.game.status) {
      case GAME_STATUS.WAITING_FOR_PLAYERS:
        return this.renderLobby();
      case GAME_STATUS.PLAYING:
        return this.renderPlayingGame();
      default:
        return <Redirect to="/" />;
    }
  }

  render() {
    return (
      <div>
        {this.state.game &&
          <PlayersList
            players={this.state.players}
            onKickPlayer={this.kickPlayer}
            canKickPlayer={this.state.game._canKick}
          />}
        {this.state.game && 
          <CurrentPlayer 
            player={this.state.currentPlayer} 
            onCardPlay={this.onCardPlay}
            selectedCard={this.state.selectedCard}
          />} 
        {this.state.game && this.renderByStatus()}
      </div>
    );
  }
}

Home.propTypes = {
  match: PropTypes.object.isRequired
};

export default Home;
