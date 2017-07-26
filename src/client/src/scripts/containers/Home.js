import React, { Component } from "react";
import { Link } from "react-router-dom";
import actions from "../store/actions";
import Games from "../components/Games";
import authenticationService from "../services/authentication";
import "../../styles/Home.css";

export default class Home extends Component {
  state = {
    games: {
      lobby: [],
      playing: []
    },
    user: authenticationService.getUser()
  };

  componentWillMount() {
    actions.getGames().then(games => {
      this.setState({
        games
      });
    });
  }

  onSelectGame(game) {
    this.props.history.push(`/games/${game.id}`);
  }

  deleteGame(gameId) {
    actions.deleteGame(gameId);
  }

  render() {
    return (
      <div className="home">
        <p className="home__welcome">
          Welcome {this.state.user.name}
        </p>
        <Link to="/game-creation" className="home__game-creation-button">
          Create
        </Link>
        <h3 className="home__title">Lobby</h3>
        <Games
          games={this.state.games.lobby}
          deleteGame={this.deleteGame.bind(this)}
          onSelectGame={this.onSelectGame.bind(this)}
        />
        <h3 className="home__title">Your games</h3>
        <Games
          games={this.state.games.playing}
          deleteGame={this.deleteGame.bind(this)}
          onSelectGame={this.onSelectGame.bind(this)}
        />
      </div>
    );
  }
}
