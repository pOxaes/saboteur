import React from "react";
import { Redirect, Route } from "react-router-dom";

import userService from "./services/user";

const isAuthenticated = () => !!userService.get();

const PUBLIC_ROOT = "/login";

const AuthRoute = ({ component, ...props }) => {
  if (isAuthenticated()) {
    return <Route {...props} component={component} />;
  } else {
    return <Redirect to={PUBLIC_ROOT} />;
  }
};

export default AuthRoute;
