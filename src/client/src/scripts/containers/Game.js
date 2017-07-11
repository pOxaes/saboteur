import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import PlayersList from "../components/PlayersList";

const GAME_STATUS = {
  LOBBY: "LOBBY",
  PLAYING: "PLAYING"
};

const MOCKS = {
  lobby: {
    _canKick: true,
    status: GAME_STATUS.LOBBY,
    players: [
      {
        name: "Hugo",
        id: 0
      },
      {
        name: "Vincent",
        id: 1
      }
    ]
  },

  playing: {
    _canKick: false,
    status: GAME_STATUS.PLAYING,
    id: 1,
    currentPlayerId: 4,
    deck: 12,
    players: [
      {
        name: "Hugo",
        id: 0,
        malus: ["pickaxe"],
        cards: [
          {
            nature: "build",
            path: 1010
          },
          {
            nature: "malus",
            type: "light"
          },
          {
            nature: "bonus",
            type: ["pickaxe", "chariot"]
          },
          {
            nature: "destroy"
          }
        ],
        gold: [1],
        role: "builder"
      },
      {
        name: "Vincent",
        id: 1,
        malus: ["chariot"],
        cardsCount: 3,
        cards: [
          {
            nature: "hidden"
          },
          {
            nature: "hidden"
          },
          {
            nature: "hidden"
          },
          {
            nature: "hidden"
          }
        ],
        gold: [3]
      },
      {
        name: "Samuel",
        id: 2,
        malus: [],
        cards: [
          {
            nature: "hidden"
          },
          {
            nature: "hidden"
          },
          {
            nature: "hidden"
          }
        ],
        gold: [2]
      },
      {
        name: "Viet",
        id: 3,
        malus: ["light"],
        cards: [
          {
            nature: "hidden"
          },
          {
            nature: "hidden"
          },
          {
            nature: "hidden"
          }
        ],
        gold: [0]
      },
      {
        name: "Gab",
        id: 4,
        malus: [],
        cards: [
          {
            nature: "hidden"
          },
          {
            nature: "hidden"
          },
          {
            nature: "hidden"
          },
          {
            nature: "hidden"
          }
        ],
        gold: [3]
      }
    ]
  }
};

export default class Home extends Component {
  state = {
    game: {}
  };

  componentWillMount() {
    this.setState({ id: this.props.match.params.gameId });
    // TODO: FETCH GAME
    this.setState({ game: MOCKS.playing });
  }

  isLobby() {
    return this.state.game && this.state.game.status === GAME_STATUS.LOBBY;
  }

  kickPlayer(player) {
    // TODO: kick player
    console.log("kick", player, this.state.id);
  }

  renderLobby() {
    return (
      <p>
        Lobby #{this.state.game.id}
      </p>
    );
  }

  renderPlayingGame() {
    return (
      <p>
        Playing #{this.state.game.id}
      </p>
    );
  }

  renderByStatus() {
    switch (this.state.game.status) {
      case GAME_STATUS.LOBBY:
        return this.renderLobby();
      case GAME_STATUS.PLAYING:
        return this.renderPlayingGame();
      default:
        return <Redirect to="/" />;
    }
  }

  render() {
    return (
      <div>
        <h2>
          Current - {this.state.id}
        </h2>
        <PlayersList
          players={this.state.game.players}
          onKickPlayer={this.kickPlayer.bind(this)}
          canKickPlayer={this.state.game._canKick}
        />
        {this.renderByStatus()}
      </div>
    );
  }
}
