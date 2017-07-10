import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import '../styles/App.css';

import HomeContainer from './containers/Home';
import RegisterContainer from './containers/Register';
import GameContainer from './containers/Game';

class App extends Component {
  render() {
    return (
      <div className="App">
        Welcome
        <Switch>
          <Route exact path="/" component={ HomeContainer } />
          <Route path="/games/:gameId" component={ GameContainer } />
          <Route path="/register" component={ RegisterContainer } />
        </Switch>
      </div>
    );
  }
}

export default App;
