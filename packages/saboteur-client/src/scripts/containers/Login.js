import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import authenticationService from "../services/authentication";
import wsService from "../services/ws";
import DoubleColorTitle from "../components/DoubleColorTitle";
import "../../styles/Login.css";

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
      <div className="login view__wrapper">
        <h1 className="view__title">
          <DoubleColorTitle text="Saboteur" />
        </h1>
        <div className="view__content">
          <GoogleLogin
            clientId={authenticationService.GOOGLE_CLIENT_ID}
            buttonText="Google Login"
            responseType="code"
            className="login__google-button"
            onSuccess={this._handleLoginSucessful.bind(this)}
            onFailure={(...args) => console.log("error", args)}
          />
        </div>
      </div>
    );
  }
}
