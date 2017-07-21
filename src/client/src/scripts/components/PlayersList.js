import React, { Component } from "react";
import Player from "./Player";
import ReactResizeDetector from 'react-resize-detector';
import "../../styles/PlayersList.css";

const RESIZE_THROTTLE_TIME = 300;

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
    resizeTimeout: undefined,
    lastResizeDate: undefined,
    positions: [],
  };

  getPlayerStyle(playerIndex) {
    return {
      left: `${this.state.positions[playerIndex].x}px`,
      top: `${this.state.positions[playerIndex].y}px`,
    };
  }

  onResize() {
    const now = new Date().getTime();
    if (this.state.resizeTimeout) {
      clearTimeout(this.state.resizeTimeout);
    }
    if (!this.state.lastResizeDate || now - this.state.lastResizeDate > RESIZE_THROTTLE_TIME) {
      this.setState({
        lastResizeDate: now,
      });
      this.updatePositions();
    } else {
      this.setState({
        resizeTimeout: setTimeout(this.onResize.bind(this), RESIZE_THROTTLE_TIME),
      });
    }
  }

  updatePositions() {
    const positions = [];

    const bodyClientRect = document.body.getBoundingClientRect();
    const circleXPadding = -20;
    const circleYPadding = -20;

    const circleRadius = (bodyClientRect.width - 2 * circleXPadding) / 2;
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

  componentWillMount() {
    this.updatePositions();
  }

  render() {
    return (
      <div className="players-list">
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize.bind(this)} />
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
