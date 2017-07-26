import React from "react";
import { Redirect, Route } from "react-router-dom";
import authenticationService from "./services/authentication";
import wsService from "./services/ws";

const isAuthenticated = () => !!authenticationService.isAuthenticated();

const PUBLIC_ROOT = "/login";

const AuthRoute = ({ component, ...props }) => {
  if (isAuthenticated()) {
    if (wsService.isConnected()) {
      return <Route {...props} component={component} />;
    } else {
      return <p>Connecting to WS, please wait</p>;
    }
  } else {
    return <Redirect to={PUBLIC_ROOT} />;
  }
};

export default AuthRoute;
