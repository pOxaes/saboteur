import React, { Component } from "react";
import { Link } from "react-router-dom";
import events from "saboteur-shared/dist/events";
import actions from "../store/actions";
import Games from "../components/Games";
import "../../styles/Home.css";

export default class Home extends Component {
  state = {
    eventsInitialized: false,
    games: {
      lobby: [],
      playing: []
    }
  };

  componentDidMount() {
    if (!this.state.games.length) {
      this.getGames();
    }
    this.initEvents(this.props.ws);
  }

  componentWillReceiveProps({ ws }) {
    if (this.state.games) {
      this.getGames();
    }
    this.initEvents(ws);
  }

  initEvents(ws) {
    if (!ws || this.state.eventsInitialized) {
      return;
    }
    this.setState({
      eventsInitialized: true
    });
    ws.on(events.CREATE_GAME, this.addGame.bind(this));
    ws.on(events.DELETE_GAME, this.removeGame.bind(this));
  }

  addGame(newGame) {
    this.state.games.lobby.push(newGame);
    this.setState({
      games: this.state.games
    });
  }

  removeGame({ gameId }) {
    const updatedGames = Object.keys(
      this.state.games
    ).reduce((acc, gameType) => {
      acc[gameType] = this.state.games[gameType].filter(
        game => game.id !== gameId
      );
      return acc;
    }, {});
    this.setState({
      games: updatedGames
    });
  }

  componentWillUnmount() {
    this.props.ws.removeListener(events.CREATE_GAME);
  }

  getGames() {
    actions.getGames().then(games => {
      this.setState({
        games
      });
    });
  }

  onSelectGame(game) {
    this.props.history.push(`/games/${game.id}`);
  }

  deleteGame(type, gameId) {
    actions.deleteGame(gameId);
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
