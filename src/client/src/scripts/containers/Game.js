import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import userService from "../services/user";
import request from "../services/request";
import PlayersList from "../components/PlayersList";

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
    request.get(`http://localhost:3008/games/${this.state.id}`).then(game => {
      this.withPosition(game.players);
      this.setState({
        game
      });
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
  };

  renderLobby() {
    return (
      <p>
        {/*Lobby #{this.state.game.id}*/}
      </p>
    );
  }

  renderPlayingGame() {
    return (
      <p>
        {/*Playing #{this.state.game.id}*/}
      </p>
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
            players={this.state.game.players}
            onKickPlayer={this.kickPlayer}
            canKickPlayer={this.state.game._canKick}
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
