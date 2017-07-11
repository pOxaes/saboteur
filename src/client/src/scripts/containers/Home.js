import React, { Component } from "react";
import request from "../services/request";
import Games from "../components/Games";
import userService from "../services/user";

export default class Home extends Component {
  state = {
    games: [],
    user: userService.get()
  };

  componentWillMount() {
    request.get("http://localhost:3008/games").then(games => {
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
        <Games
          games={this.state.games}
          onSelectGame={this.onSelectGame.bind(this)}
        />
      </div>
    );
  }
}
