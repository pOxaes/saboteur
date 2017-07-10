import React, { Component } from 'react';

import Games from '../components/Games';
let state;
export default class Home extends Component {
  state = {
    games: [],
  };

  componentWillMount() {
    // TODO: FETCH GAMES
    this.setState({ games: [{
      id: 0,
      name: '#1'
    }]});
  }

  render() {
    return (
      <div>
        <h2>Home</h2>
        <Games games={ this.state.games } onSelectGame={ this.onSelectGame.bind(this) }/>
      </div>
    );
  }

  onSelectGame(game) {
    this.props.history.push('/games/' + game.id);
  }
};
