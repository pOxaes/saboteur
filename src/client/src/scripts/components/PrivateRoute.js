import React from "react";
import { Redirect, Route } from "react-router-dom";
import withAuth from "./WithAuth";

const PrivateRoute = ({
  Component,
  authenticated,
  user,
  wsConnected,
  ...rest
}) =>
  <Route
    {...rest}
    render={props => {
      return authenticated
        ? <Component {...props} user={user} wsConnected={wsConnected} />
        : <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />;
    }}
  />;

export default withAuth(PrivateRoute);
