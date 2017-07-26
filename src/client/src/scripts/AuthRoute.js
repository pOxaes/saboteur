import React from "react";
import { Redirect, Route } from "react-router-dom";
import authenticationService from "./services/authentication";

const isAuthenticated = () => !!authenticationService.isAuthenticated();

const PUBLIC_ROOT = "/login";

const AuthRoute = ({ component, ...props }) => {
  if (isAuthenticated()) {
    return <Route {...props} component={component} />;
  } else {
    return <Redirect to={PUBLIC_ROOT} />;
  }
};

export default AuthRoute;
