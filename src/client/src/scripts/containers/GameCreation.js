import React, { Component } from "react";
import actions from "../store/actions";
import Games from "../components/Games";
import userService from "../services/user";

export default class GameCreation extends Component {
  state = {
    name: "My Super Game",
    maxPlayers: "5",
  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  submit(event) {
    event.preventDefault();
    actions.createGame({ name: this.state.name, maxPlayers: this.state.maxPlayers })
      .then(game => {
        this.props.history.replace(`games/${game.id}`);
      });
  }

  render() {
    return (
      <div>
        <h2>Game creation</h2>
        <form onSubmit={this.submit.bind(this)}>
          <label>
            <p>Your game name</p>
            <input
              type="text"
              name="name"
              placeholder="name"
              onChange={this.handleChange.bind(this)}
              value={this.state.name}
              required
            />
          </label>

          <label>
            <p>Max players (2 - 10)</p>
            <input
              type="number"
              name="maxPlayers"
              placeholder="Max players"
              onChange={this.handleChange.bind(this)}
              value={this.state.maxPlayers}
              min="2"
              max="10"
              required
            />
          </label>

          <button className="button" type="submit">
            Create
          </button>
        </form>
      </div>
    );
  }
}