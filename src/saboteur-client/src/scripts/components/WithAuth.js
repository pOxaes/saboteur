import React, { Component } from "react";
import authenticationService from "../services/authentication";

function withAuth(WrappedComponent) {
  return class extends Component {
    constructor() {
      super();
      this.state = { authenticated: authenticationService.isAuthenticated() };
      this._handleAuthChanged = this._handleAuthChanged.bind(this);
    }

    _handleAuthChanged(authenticated) {
      // TODO: understand what's happening : Not using sync api because I get in redirect loop :/
      this.setState(state => ({ authenticated }));
    }

    componentDidMount() {
      authenticationService.addChangeListener(this._handleAuthChanged);
    }

    componentWillUnmount() {
      authenticationService.removeChangeListener(this._handleAuthChanged);
    }

    render() {
      const { authenticated } = this.state;
      return <WrappedComponent {...this.props} authenticated={authenticated} />;
    }
  };
}

export default withAuth;
