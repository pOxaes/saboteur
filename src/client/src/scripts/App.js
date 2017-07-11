import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "../styles/variables.css";
import "../styles/App.css";

import HomeContainer from "./containers/Home";
import LoginContainer from "./containers/Login";
import GameContainer from "./containers/Game";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={HomeContainer} />
          <Route path="/games/:gameId" component={GameContainer} />
          <Route path="/login" component={LoginContainer} />
        </Switch>
      </div>
    );
  }
}

export default App;
