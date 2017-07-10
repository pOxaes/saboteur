import React, { Component } from 'react';
let state;
export default class Register extends Component {
  state = {
    email: '',
    password: '',
  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  submit(event) {
      event.preventDefault();
      this.props.history.push('/');
      // TODO: SUBMIT FORM
  }

  render() {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={this.submit.bind(this)}>
          <input type="email"
            name="email"
            placeholder="email"
            onChange={this.handleChange.bind(this)}
            value={this.state.email}
            required/>

          <input type="password"
            name="password"
            placeholder="password"
            onChange={this.handleChange.bind(this)}
            value={this.state.password}
            required/>

          <button className="button" type="submit">
              Login
          </button>
        </form>
      </div>
    );
  }
};
