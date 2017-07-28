import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import authenticationService from "./services/authentication";
import wsService from "./services/ws";
import "../styles/variables.css";
import "../../node_modules/reset-css/reset.css";
import "../styles/App.css";

import PrivateRoute from "./components/PrivateRoute";
import HomeContainer from "./containers/Home";
import LoginContainer from "./containers/Login";
import GameContainer from "./containers/Game";
import GameCreationContainer from "./containers/GameCreation";

class App extends Component {
  constructor(props) {
    super(props);

    this.props.history.listen((location, action) => {
      this.checkLogin();
    });
  }

  state = {
    wsConnected: false
  };

  checkLogin() {
    if (!authenticationService.isAuthenticated()) {
      return;
    }
    wsService.connect(authenticationService.getToken()).then(user => {
      this.setState({
        wsConnected: true,
        user
      });
    });
  }

  componentWillMount() {
    this.checkLogin();
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <PrivateRoute
            path="/games/:id"
            wsConnected={this.state.wsConnected}
            user={this.state.user}
            Component={GameContainer}
          />
          <PrivateRoute
            path="/game-creation"
            wsConnected={this.state.wsConnected}
            user={this.state.user}
            Component={GameCreationContainer}
          />
          <Route
            path="/login"
            component={LoginContainer}
            onChange={() => {
              console.log("changed");
            }}
          />
          <PrivateRoute
            exact
            path="/"
            wsConnected={this.state.wsConnected}
            user={this.state.user}
            Component={HomeContainer}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
