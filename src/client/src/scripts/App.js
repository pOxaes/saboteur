import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./AuthRoute";
import userService from "./services/user";
import "../styles/variables.css";
import "../../node_modules/reset-css/reset.css";
import "../styles/App.css";

import HomeContainer from "./containers/Home";
import LoginContainer from "./containers/Login";
import GameContainer from "./containers/Game";
import GameCreationContainer from "./containers/GameCreation";

const isLoggedIn = () => !!userService.get();

const requireAuth = (nextState, replace) => {
  console.log("requireAuth", isLoggedIn(), replace);
  if (!isLoggedIn()) {
    replace({
      pathname: "/login"
    });
  }
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <PrivateRoute
            path="/games/:gameId"
            component={GameContainer}
            onEnter={requireAuth}
          />
          <PrivateRoute
            path="/game-creation"
            component={GameCreationContainer}
            onEnter={requireAuth}
          />
          <Route path="/login" component={LoginContainer} />
          <PrivateRoute
            path="/"
            component={HomeContainer}
            onEnter={requireAuth}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
