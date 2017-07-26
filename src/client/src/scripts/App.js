import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./AuthRoute";
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
          <PrivateRoute path="/games/:gameId" component={GameContainer} />
          <PrivateRoute
            path="/game-creation"
            component={GameCreationContainer}
          />
          <Route path="/login" component={LoginContainer} />
          <PrivateRoute path="/" component={HomeContainer} />
        </Switch>
      </div>
    );
  }
}

export default App;
