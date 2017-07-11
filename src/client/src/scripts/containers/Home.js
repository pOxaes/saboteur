import React, { Component } from 'react';

import Games from '../components/Games';

export default class Home extends Component {
  state = {
    games: [],
  };

  componentWillMount() {
    // TODO: FETCH GAMES
    this.setState({
      games: [{
        id: 0,
        name: '#1',
      }],
    });
  }

  onSelectGame(game) {
    this.props.history.push(`/games/${game.id}`);
  }

  render() {
    return (
      <div>
        <h2>Home</h2>
        <Games
          games={this.state.games}
          onSelectGame={this.onSelectGame.bind(this)}
        />
      </div>
    );
  }
}
