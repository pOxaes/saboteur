import React, { Component } from "react";
import { Link } from "react-router-dom";
import actions from "../store/actions";
import Games from "../components/Games";
import "../../styles/Home.css";

export default class Home extends Component {
  state = {
    games: {
      lobby: [],
      playing: []
    }
  };

  componentWillReceiveProps() {
    if (this.state.games) {
      actions.getGames().then(games => {
        this.setState({
          games
        });
      });
    }
  }

  onSelectGame(game) {
    this.props.history.push(`/games/${game.id}`);
  }

  deleteGame(type, gameId) {
    actions.deleteGame(gameId).then(() => {
      const gamesState = this.state.games;
      const newGamesState = gamesState[type].filter(game => game.id !== gameId);
      this.setState({
        games: newGamesState
      });
    });
  }

  render() {
    return (
      <div className="home">
        <p className="home__welcome">
          Welcome {this.props.user && this.props.user.name}
        </p>
        <Link to="/game-creation" className="home__game-creation-button">
          Create
        </Link>
        <h3 className="home__title">Lobby</h3>
        <Games
          games={this.state.games.lobby}
          deleteGame={this.deleteGame.bind(this, "lobby")}
          onSelectGame={this.onSelectGame.bind(this)}
        />
        <h3 className="home__title">Your games</h3>
        <Games
          games={this.state.games.playing}
          deleteGame={this.deleteGame.bind(this, "playing")}
          onSelectGame={this.onSelectGame.bind(this)}
        />
      </div>
    );
  }
}
