import React, { Component } from 'react';

const GAME_STATUS = {
  LOBBY: 'LOBBY',
  PLAYING: 'PLAYING',
};

export default class Home extends Component {
  state = {
    game: {},
  };

  componentWillMount() {
    this.setState({ id: this.props.match.params.gameId });
    // TODO: FETCH GAME
    this.setState({ game: {
      status: GAME_STATUS.LOBBY,
    }});
  }

  renderLobby() {
    return (
      <p>Lobby</p>
    );
  }

  renderPlayingGame() {
    return (
      <p>Playing</p>
    );
  }

  renderByStatus() {
    switch (this.state.game.status) {
      case GAME_STATUS.LOBBY: return this.renderLobby();
      case GAME_STATUS.PLAYING: return this.renderPlayingGame();
    }
  }

  render() {
    return (
      <div>
        <h2>Current - { this.state.id }</h2>
        { this.renderByStatus() }
      </div>
    );
  }

  isLobby() {
    return this.state.game
      && this.state.game.status === GAME_STATUS.LOBBY;
  }
};
