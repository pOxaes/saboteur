import React, { Component } from "react";
import Player from "./Player";
import "../../styles/PlayersList.css";

export default class PlayersList extends Component {
  state = {
    positions: []
  };

  getPlayerItemClass(playerId) {
    return [
      "player-list__item",
      this.props.playingId === playerId && "player-list__item--playing"
    ].join(" ");
  }

  render() {
    return (
      <div className="players-list">
        {this.props.players.length === 0
          ? <p>No players</p>
          : this.props.players.map((player, index) =>
              <li
                className={this.getPlayerItemClass(player.id)}
                key={player.id}
              >
                <Player
                  player={player}
                  onClick={this.props.selectPlayer}
                  canKick={this.props.canKickPlayer}
                  kick={this.props.onKickPlayer}
                />
              </li>
            )}
      </div>
    );
  }
}
