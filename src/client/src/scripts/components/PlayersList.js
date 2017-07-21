import React, { Component } from "react";
import ReactDOM from "react-dom";
import Player from "./Player";
import "../../styles/PlayersList.css";

const degToRad = deg => deg * Math.PI / 180;

const getDirectionFromAngle = angle => {
  if (angle < 50) {
    return "right";
  } else if (angle < 130) {
    return "bottom";
  } else {
    return "left";
  }
}

export default class PlayersList extends Component {
  state = {
    positions: [],
  };

  getPlayerStyle(playerIndex) {
    return {
      left: `${this.state.positions[playerIndex].x}px`,
      top: `${this.state.positions[playerIndex].y}px`,
    };
  }

  componentWillMount() {
    document.body.addEventListener("click", (e) => {
      console.log(e.clientX, e.clientY);
    });

    const positions = [];

    const bodyClientRect = document.body.getBoundingClientRect();
    const circleXPadding = 75;
    const circleYPadding = 30;

    const circleRadius = Math.min(bodyClientRect.width - 2 * circleXPadding, bodyClientRect.height - 2 * circleYPadding) / 2;
    const circleY = circleRadius + circleYPadding;
    const circleX = circleRadius + circleXPadding;

    const angle = 180 / this.props.players.length;
    const angleOffset = angle / 2;

    for (let rotateVal = angleOffset; rotateVal < 180 + angleOffset; rotateVal += angle) {
      positions.push({
        x: circleX - circleRadius * Math.cos(degToRad(rotateVal)),
        y: circleY - circleRadius * Math.sin(degToRad(rotateVal)),
        direction: getDirectionFromAngle(rotateVal),
      });
    }
    this.setState({
      positions,
    });
  }

  render() {
    return (
      <div className="players-list">
        {this.props.players.length === 0
          ? <p>No players</p>
          : this.props.players.map((player, index) =>
              <li className="player-list__item" 
                key={player.id}
                style={this.getPlayerStyle(index)}>
                <Player
                  player={player}
                  canKick={this.props.canKickPlayer}
                  kick={this.props.onKickPlayer}
                  direction={this.state.positions[index].direction}
                />
              </li>
            )}
      </div>
    );
  }
}
