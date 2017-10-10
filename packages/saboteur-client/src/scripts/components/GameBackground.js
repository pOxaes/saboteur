import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactResizeDetector from "react-resize-detector";
import { draw } from "../services/gameBackground";
import "../../styles/GameBackground.css";

const RESIZE_THROTTLE_TIME = 400;

export default class GameBackground extends Component {
  state = {
    canvasSize: {
      width: undefined,
      height: undefined
    }
  };

  resizeTimeout = undefined;
  lastResizeDate = undefined;

  componentDidMount() {
    this.updateSize();
  }

  updateCanvas(canvasSize) {
    if (this.refs && this.refs.canvas) {
      this.refs.canvas.width = canvasSize.width;
      this.refs.canvas.height = canvasSize.height;
      const ctx = this.refs.canvas.getContext("2d");
      draw(ctx, canvasSize);
    }
  }

  onResize() {
    const now = new Date().getTime();
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = undefined;
    }

    if (
      !this.lastResizeDate ||
      now - this.lastResizeDate > RESIZE_THROTTLE_TIME
    ) {
      this.updateSize();
    } else {
      this.resizeTimeout = setTimeout(
        this.onResize.bind(this),
        RESIZE_THROTTLE_TIME
      );
    }
    this.lastResizeDate = now;
  }

  updateSize() {
    const rootEl = ReactDOM.findDOMNode(this);
    const rootElBoundingRect = rootEl.getBoundingClientRect();
    const canvasSize = {
      width: rootElBoundingRect.width,
      height: rootElBoundingRect.height
    };
    this.updateCanvas.bind(this)(canvasSize);
    return this.setState({ canvasSize });
  }

  render() {
    return (
      <div className="game-background">
        <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={this.onResize.bind(this)}
        />

        <canvas
          className="game-background__canvas"
          ref="canvas"
          width="300"
          height="300"
        />
      </div>
    );
  }
}
