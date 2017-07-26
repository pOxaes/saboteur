import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import authenticationService from "./services/authentication";
import wsService from "./services/ws";
import "../styles/variables.css";
import "../../node_modules/reset-css/reset.css";
import "../styles/App.css";

import PrivateRoute from "./AuthRoute";
import HomeContainer from "./containers/Home";
import LoginContainer from "./containers/Login";
import GameContainer from "./containers/Game";
import GameCreationContainer from "./containers/GameCreation";

class App extends Component {
  state = {
    wsConnected: false
  };

  componentWillMount() {
    if (authenticationService.isAuthenticated()) {
      wsService.connect(authenticationService.getToken()).then(() => {
        this.setState({
          wsConnected: true
        });
      });
    }
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <PrivateRoute
            path="/games/:gameId"
            wsConnected={this.statewsConnected}
            component={GameContainer}
          />
          <PrivateRoute
            path="/game-creation"
            wsConnected={this.statewsConnected}
            component={GameCreationContainer}
          />
          <Route path="/login" component={LoginContainer} />
          <PrivateRoute
            path="/"
            wsConnected={this.statewsConnected}
            component={HomeContainer}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
