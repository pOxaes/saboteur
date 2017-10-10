import React, { Component } from "react";
import actions from "../store/actions";
import DoubleColorTitle from "../components/DoubleColorTitle";
import PlayerAvatar from "../components/PlayerAvatar";

export default class GameCreation extends Component {
  state = {
    name: "My Super Game",
    maxPlayers: "5",
    min: 3,
    max: 10
  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  submit(event) {
    const self = this;
    event.preventDefault();
    actions
      .createGame({ name: this.state.name, maxPlayers: this.state.maxPlayers })
      .then(game => {
        self.props.history.replace(`/games/${game.id}`);
      });
  }

  componentWillReceiveProps(nextProps) {
    const min = 3;
    const max = 10;
    this.setState({
      sliderPercent: (nextProps.mexPlayers - min) * (100 / (max - min)) + "%"
    });
  }

  render() {
    return (
      <div className="view__wrapper game-creation">
        <h1 className="view__title">
          <DoubleColorTitle text="Saboteur" />
          <span className="view__title__caption">Game creation</span>
        </h1>
        <form className="view__content" onSubmit={this.submit.bind(this)}>
          <div className="home__avatar">
            {this.props.user &&
              <PlayerAvatar
                size={100}
                avatar={this.props.user.avatarUrl}
                modifiers={{ isBig: true, hasPlainBackground: true }}
              />}
          </div>
          <div className="view__section">
            <label className="form-field">
              <div className="form-field__label">Game title</div>
              <div className="form-field__input">
                <input
                  type="text"
                  name="name"
                  maxLength="50"
                  placeholder="name"
                  onChange={this.handleChange.bind(this)}
                  value={this.state.name}
                  required
                />
              </div>
            </label>
          </div>
          <div className="view__section view__section--dark">
            <label className="form-field">
              <div className="form-field__label">Max players</div>
              <div className="form-field__input form-field__input--slider">
                <span>3</span>
                <div className="form-field__slider">
                  <input
                    type="range"
                    name="maxPlayers"
                    placeholder="Max players"
                    onChange={this.handleChange.bind(this)}
                    value={this.state.maxPlayers}
                    min="3"
                    max="10"
                    step="1"
                    required
                  />
                  <div className="form-field__slider__value__container">
                    <span
                      className="form-field__slider__value"
                      style={{
                        left:
                          (this.state.maxPlayers - this.state.min) *
                            (100 / (this.state.max - this.state.min)) +
                          "%"
                      }}
                    >
                      {this.state.maxPlayers}
                    </span>
                  </div>
                </div>
                <span>10</span>
              </div>
            </label>
            <div className="form-actions">
              <button className="button" type="submit">
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
