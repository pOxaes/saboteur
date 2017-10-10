import React, { Component } from "react";
import Player from "./Player";
import "../../styles/PlayersList.css";

function computePlayersListClassName({ isLobby, isLeaderBoard }) {
  return [
    "players-list",
    isLobby && "players-list--lobby",
    isLeaderBoard && "players-list--leaderboard"
  ].join(" ");
}
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

  _renderMissingPlayers() {
    const missingPlayers = [];

    for (
      var i = 0, len = this.props.players.length;
      i < this.props.maxPlayers - len;
      i++
    ) {
      missingPlayers.push(
        <li className="player-list__item" key={i}>
          <div className="player player--empty" />
        </li>
      );
    }
    return missingPlayers;
  }

  render() {
    const {
      players,
      selectPlayer,
      canKickPlayer,
      currentUser,
      onKickPlayer,
      modifiers = {}
    } = this.props;
    const { isLobby, highlight } = modifiers;
    return (
      <div className={computePlayersListClassName(modifiers)}>
        {players.length === 0
          ? <p>No players</p>
          : players.map((player, index) =>
              <li
                className={this.getPlayerItemClass(player.id)}
                key={player.id}
              >
                <Player
                  player={player}
                  onClick={selectPlayer}
                  canKick={canKickPlayer && player.id !== currentUser}
                  kick={onKickPlayer}
                  modifiers={{ isLobby, highlight }}
                />
              </li>
            )}
        {modifiers.isLobby && this._renderMissingPlayers()}
      </div>
    );
  }
}
