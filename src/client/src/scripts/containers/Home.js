import React, { Component } from "react";
import actions from "../store/actions";
import Games from "../components/Games";
import userService from "../services/user";

export default class Home extends Component {
  state = {
    games: {
      lobby: [],
      playing: [],
    },
    user: userService.get()
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

  render() {
    return (
      <div>
        <h2>Home</h2>
        <p>
          Welcome {this.state.user.name}
        </p>
        <h3>Lobby</h3>
        <Games
          games={this.state.games.lobby}
          onSelectGame={this.onSelectGame.bind(this)}
        />
        <h3>Your games</h3>
        <Games
          games={this.state.games.playing}
          onSelectGame={this.onSelectGame.bind(this)}
        />
        <a href="/game-creation">Create</a>
      </div>
    );
  }
}
