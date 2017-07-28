import React, { Component } from "react";
import Player from "./Player";
import ReactResizeDetector from "react-resize-detector";
import "../../styles/PlayersList.css";

const RESIZE_THROTTLE_TIME = 300;

const computePlayersListClass = displayType =>
  ["players-list", `players-list--display-${displayType}`].join(" ");

// const drawCircle = (radius, x, y) => {
//   const circle = document.createElement('div');
//   circle.style.position = "absolute";
//   circle.style.left = x + "px";
//   circle.style.top = y + "px";
//   circle.style.marginLeft = -radius + "px";
//   circle.style.marginTop = -radius + "px";
//   circle.style.width = 2 * radius - 4 + "px";
//   circle.style.height = 2 * radius - 4 + "px";
//   circle.style.pointerEvents = "none";
//   circle.style.borderRadius = "50%";
//   circle.style.border = "2px solid rgba(255, 0, 0, .2)";
//   circle.style.boxSizing = "content-box";
//   document.body.appendChild(circle);
// }

// const drawLine = (radius, rotateVal, x, y, circleX, circleY) => {
//   const line = document.createElement("div");
//   line.style.border = "1px solid rgba(255, 0, 0, 0.2)";
//   line.style.width = 2 * radius + "px";
//   line.style.height = "0px";
//   line.style.pointerEvents = "none";
//   line.style.position = "absolute";
//   line.style.top = circleY + "px";
//   line.style.left = circleX + "px";
//   line.style.marginLeft = -radius + "px";
//   line.style.transform = `rotate(${rotateVal}deg)`;

//   const dot = document.createElement("div");
//   dot.style.background = "green";
//   dot.style.position = "absolute";
//   dot.style.width = "10px";
//   dot.style.height = "10px";
//   dot.style.top = y + "px";
//   dot.style.pointerEvents = "none";
//   dot.style.left = x + "px";
//   dot.style.marginLeft = "-5px";
//   dot.style.marginTop = "-5px";
//   dot.style.borderRadius = "50%";

//   document.body.appendChild(line);
//   document.body.appendChild(dot);
// }

const degToRad = deg => deg * Math.PI / 180;

const getDirectionFromAngle = angle => {
  if (angle < 80) {
    return "right";
  } else if (angle < 110) {
    return "bottom";
  } else {
    return "left";
  }
};

export default class PlayersList extends Component {
  state = {
    resizeTimeout: undefined,
    lastResizeDate: undefined,
    positions: []
  };

  getPlayerStyle(playerIndex) {
    return this.state.positions
      ? {
          left: `${this.state.positions[playerIndex].x}px`,
          top: `${this.state.positions[playerIndex].y}px`
        }
      : {};
  }

  getPlayerItemClass(playerId) {
    console.log(
      this.props.playingId,
      playerId,
      this.props.playingId == playerId
    );
    return [
      "player-list__item",
      this.props.playingId === playerId && "player-list__item--playing"
    ].join(" ");
  }

  onResize() {
    const now = new Date().getTime();
    if (this.state.resizeTimeout) {
      clearTimeout(this.state.resizeTimeout);
    }
    if (
      !this.state.lastResizeDate ||
      now - this.state.lastResizeDate > RESIZE_THROTTLE_TIME
    ) {
      this.setState({
        lastResizeDate: now
      });
      this.updatePositions();
    } else {
      this.setState({
        resizeTimeout: setTimeout(
          this.onResize.bind(this),
          RESIZE_THROTTLE_TIME
        )
      });
    }
  }

  getPositions(bodyClientRect) {
    const maxAngle = 210;
    const positions = [];

    const circleXPadding = 0;
    const circleYPadding = 0;

    const circleRadius = Math.min(
      (bodyClientRect.width - 2 * circleXPadding) / 2,
      (bodyClientRect.height - 2 * circleYPadding) / 1.5
    );

    const circleY = circleRadius + circleYPadding;
    const circleX = bodyClientRect.width / 2;
    // drawCircle(circleRadius, circleX, circleY);
    const angle = maxAngle / this.props.players.length;
    const angleOffset = angle / 2 - (maxAngle - 180) / 2;

    for (
      let rotateVal = angleOffset;
      rotateVal < maxAngle + angleOffset;
      rotateVal += angle
    ) {
      let xFromCenter = circleRadius * Math.cos(degToRad(rotateVal));
      let yFromCenter = circleRadius * Math.sin(degToRad(rotateVal));

      let x = circleX - xFromCenter;
      let y = circleY - yFromCenter;

      positions.push({
        x,
        y,
        direction: getDirectionFromAngle(rotateVal, x, y)
      });
    }

    return positions;
  }

  updatePositions() {
    const bodyClientRect = document.body.getBoundingClientRect();
    const isDisplayInline = bodyClientRect.width < 750;
    this.setState({
      positions: isDisplayInline
        ? undefined
        : this.getPositions(bodyClientRect),
      displayType: isDisplayInline ? "inline" : "circle"
    });
  }

  componentWillMount() {
    this.updatePositions();
  }

  render() {
    return (
      <div className={computePlayersListClass(this.state.displayType)}>
        <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={this.onResize.bind(this)}
        />
        {this.props.players.length === 0
          ? <p>No players</p>
          : this.props.players.map((player, index) =>
              <li
                className={this.getPlayerItemClass(player.id)}
                key={player.id}
                style={this.getPlayerStyle(index)}
              >
                <Player
                  player={player}
                  onClick={this.props.selectPlayer}
                  canKick={this.props.canKickPlayer}
                  kick={this.props.onKickPlayer}
                  direction={
                    this.state.positions &&
                    this.state.positions[index].direction
                  }
                />
              </li>
            )}
      </div>
    );
  }
}
