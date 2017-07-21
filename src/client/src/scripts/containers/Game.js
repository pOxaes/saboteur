import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import userService from "../services/user";
import request from "../services/request";
import boardService from "../services/board";
import PlayersList from "../components/PlayersList";
import Board from "../components/Board";
import Deck from "../components/Deck";

const GAME_STATUS = {
  WAITING_FOR_PLAYERS: "WAITING_FOR_PLAYERS",
  PLAYING: "PLAYING"
};

const POSITIONS_BY_PLAYERS_COUNT = {
  2: ["bottom", "top"],
  3: ["bottom", "top-left", "top-right"],
  4: ["bottom", "left", "top", "right"],
  5: ["bottom", "left", "top-left", "top-right", "right"],
  6: ["bottom", "left", "top-left", "top", "top-right", "right"]
};

const formatCardLayout = card => {
  if (card.layout) {
    card.layout = {
      top: card.layout[0] === "1",
      right: card.layout[1] === "1",
      bottom: card.layout[2] === "1",
      left: card.layout[3] === "1",
    };
  }
}

const formatPlayerCard = (card, slots, players) => {
  formatCardLayout(card);

  if (card.type === "HIDDEN") {
    return;
  }

  // Can destroy if a card, different from the origin, exists
  if (card.action === "DESTROY") {
    card.isPlayable = slots.some(slot => slot.card && slot.card.layout && (slot.x !== 0 || slot.y !== 0));
    return;
  }

  if (card.action === "BLOCK") {
    card.isPlayable = players.some(player => !player.malus || player.malus.length === 0);
    return;
  }

  if (card.action === "FREE") {
    card.isPlayable = players.some(player =>
      player.malus && player.malus.some(malus => card.subtype.indexOf(malus) !== -1)
    );
    return;
  }

  if (card.type === "PATH") {
    card.isPlayable = slots.some(slot => !slot.card 
      && boardService.checkCardCompatibility(card, slot)
    );
  }
}

const attachLinkedToStart = (card, index, cards) => {
  card.isLinkedToStart = boardService.isLinkedToStart(card, cards);
}

export class Home extends Component {
  state = {
    id: this.props.match.params.gameId,
    user: userService.get()
  };

  withPosition(players) {
    const playersCount = players.length;
    const currentPlayerIndex = players.map(player => player.id).indexOf(this.state.user.id);
    const positionsList = POSITIONS_BY_PLAYERS_COUNT[playersCount];
    for (let i = currentPlayerIndex, j = 0; i < currentPlayerIndex + playersCount; i++, j++) {
      players[i % playersCount].position = positionsList[j];
    }
  }

  componentWillMount() {
    request.get(`http://localhost:3008/games/${this.state.id}`).then(this.updateGame.bind(this));
  }

  updateGame(game) {
    game.board.forEach(formatCardLayout);
    game.board.forEach(attachLinkedToStart);

    const slots = boardService.createSlotsFromCards(game.board);

    game.players.forEach(player => player.cards.forEach(card => formatPlayerCard(card, slots, game.players)));
    this.withPosition(game.players);
    this.setState({
      game,
      slots,
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
    if (card.type === "HIDDEN") {
      console.log("Hehe you can't see other player's cards.");
    } else 
    if (!card.isPlayable) {
      console.log("You can't play this card.");
      return;
    }
    else {
      console.log("let's play this card", card);
    }
  }

  renderLobby() {
    return (
      <p>Lobby</p>
    );
  }

  renderPlayingGame() {
    return (
      <div>
        <Board slots={this.state.slots} />
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
        {true && this.state.game &&
          <PlayersList
            players={this.state.game.players}
            onKickPlayer={this.kickPlayer}
            canKickPlayer={this.state.game._canKick}
            onCardPlay={this.onCardPlay}
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
