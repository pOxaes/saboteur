import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import authenticationService from "../services/authentication";
import wsService from "../services/ws";

export default class Register extends Component {
  state = {
    email: "",
    password: ""
  };

  _handleLoginSucessful({ code }) {
    return authenticationService
      .login(code)
      .then(() => {
        this.props.history.replace("/");
      })
      .catch(e => {
        console.error("Failed to login", e);
      });
  }

  componentWillMount() {
    authenticationService.logout();
    wsService.disconnect();
  }

  render() {
    return (
      <div>
        <h2>Login</h2>
        <GoogleLogin
          clientId={authenticationService.GOOGLE_CLIENT_ID}
          buttonText="Log in with Google"
          offline
          onSuccess={this._handleLoginSucessful.bind(this)}
          onFailure={(...args) => console.log("error", args)}
        />
      </div>
    );
  }
}
