import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "../styles/variables.css";
import "../../node_modules/reset-css/reset.css";
import "../styles/App.css";

import HomeContainer from "./containers/Home";
import LoginContainer from "./containers/Login";
import GameContainer from "./containers/Game";
import GameCreationContainer from "./containers/GameCreation";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={HomeContainer} />
          <Route path="/games/:gameId" component={GameContainer} />
          <Route path="/game-creation" component={GameCreationContainer} />
          <Route path="/login" component={LoginContainer} />
        </Switch>
      </div>
    );
  }
}

export default App;
