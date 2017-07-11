import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import request from "../services/request";
import PlayersList from "../components/PlayersList";

const GAME_STATUS = {
  WAITING_FOR_PLAYERS: "WAITING_FOR_PLAYERS",
  PLAYING: "PLAYING"
};

export class Home extends Component {
  state = {
    id: this.props.match.params.gameId
  };

  componentWillMount() {
    request.get(`http://localhost:3008/games/${this.state.id}`).then(game => {
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
        Lobby #{this.state.game.id}
      </p>
    );
  }

  renderPlayingGame() {
    return (
      <p>
        Playing #{this.state.game.id}
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
        <h2>
          Current - {this.state.id}
        </h2>
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
