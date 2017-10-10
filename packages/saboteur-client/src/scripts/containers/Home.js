import React, { Component } from "react";
import { Link } from "react-router-dom";
import events from "saboteur-shared/dist/events";
import actions from "../store/actions";
import Games from "../components/Games";
import DoubleColorTitle from "../components/DoubleColorTitle";
import PlayerAvatar from "../components/PlayerAvatar";
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
    this.initEvents(this.props.ws);
  }

  componentWillMount() {
    this.getGames();
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
    ws.on(events.UPDATE_GAME, this.updateGame.bind(this));
  }

  componentWillUnmount() {
    if (!this.props.ws) {
      return;
    }
    this.props.ws.removeListener(events.CREATE_GAME);
    this.props.ws.removeListener(events.DELETE_GAME);
    this.props.ws.removeListener(events.UPDATE_GAME);
  }

  findGame(id) {
    return Object.values(this.state.games)
      .reduce((acc, list) => {
        return acc.concat(list);
      })
      .find(game => game.id === id);
  }

  updateGame({ id, players, status }) {
    if (players) {
      const matchingGame = this.findGame(id);
      if (!matchingGame) {
        return;
      }
      matchingGame.players = players;
      this.forceUpdate();
    } else if (status) {
      let updatedGames = this.state.games;
      Object.keys(updatedGames).forEach(key => {
        updatedGames[key] = updatedGames[key].filter(game => game.id !== id);
      });

      const containsPlayer = players.some(
        player => player.id === this.props.user.id
      );

      if (!containsPlayer) {
        return;
      }

      const matchingGame = this.findGame(id);
      matchingGame.status = status;
      updatedGames.playing.push(matchingGame);
      this.setState({
        games: updatedGames
      });
    }
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

  getGames() {
    actions.getGames().then(games => {
      this.setState({
        games
      });
    });
  }

  deleteGame(type, gameId) {
    actions.deleteGame(gameId);
  }

  render() {
    return (
      <div className="home view__wrapper">
        <h1 className="view__title">
          <DoubleColorTitle text="Saboteur" />
        </h1>
        <div className="view__content">
          <div className="home__avatar">
            {this.props.user &&
              <PlayerAvatar
                size={100}
                avatar={this.props.user.avatarUrl}
                modifiers={{ isBig: true, hasPlainBackground: true }}
              />}
          </div>
          <div className="view__section">
            <h2 className="view__subtitle">Lobby</h2>
            <Games
              games={this.state.games.lobby}
              deleteGame={this.deleteGame.bind(this, "lobby")}
              showGameCreation={true}
            />
            <Link
              to="/game-creation"
              className="button button--small home__game-creation-button"
            >
              Create
            </Link>
          </div>
          <div className="view__section view__section--dark">
            <h2 className="view__subtitle">Your games</h2>
            <Games
              games={this.state.games.playing}
              deleteGame={this.deleteGame.bind(this, "playing")}
            />
          </div>
        </div>
      </div>
    );
  }
}
