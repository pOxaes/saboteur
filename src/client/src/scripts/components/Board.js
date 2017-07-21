import React, { Component } from "react";
import ReactDOM from "react-dom";
import BoardSlot from "./BoardSlot";
import ReactResizeDetector from 'react-resize-detector';
import "../../styles/Board.css";

const RESIZE_THROTTLE_TIME = 300;

const CARD_SIZE = {
  width: 63,
  height: 88,
};

const getLimitsFromSlots = slots => slots.reduce((limits, slot) => {
  Object.keys(limits).forEach(axis => {
    limits[axis].max = Math.max(slot[axis], limits[axis].max);
    limits[axis].min = Math.min(slot[axis], limits[axis].min);
  });
  return limits;
}, {
  x: {
    min: Infinity,
    max: -Infinity
  },
  y: {
    min: Infinity,
    max: -Infinity
  }
});

const getCardsCountPerAxisFromSlots = (slots, limits) => {
  return Object.keys(limits).reduce((size, axis) => {
    size[axis] = Math.abs(limits[axis].min) + Math.abs(limits[axis].max) + 1;
    return size;
  }, {});
}

const computeInnerStyle = ({ innerHeight, innerWidth }) => ({
  width: innerWidth,
  height: innerHeight,
});

export default class Board extends Component {
  state = {
    resizeTimeout: undefined,
    lastResizeDate: undefined,
    cardStyle: undefined,
    innerWidth: undefined,
    innerHeight: undefined,
  };

  onResize() {
    const now = new Date().getTime();
    if (this.state.resizeTimeout) {
      clearTimeout(this.state.resizeTimeout);
    }

    if (!this.state.lastResizeDate || now - this.state.lastResizeDate > RESIZE_THROTTLE_TIME) {
      this.setState({
        lastResizeDate: now,
      });
      this.updateSize();
    } else {
      this.setState({
        resizeTimeout: setTimeout(this.onResize.bind(this), RESIZE_THROTTLE_TIME),
      });
    }
  }

  updateSize() {
    const rootEl = ReactDOM.findDOMNode(this);
    const rootElBoundingRect = rootEl.getBoundingClientRect();
    const limits = getLimitsFromSlots(this.props.slots);

    const cardsPerAxis = getCardsCountPerAxisFromSlots(this.state.slots, limits);
    const cardWidth = rootElBoundingRect.width / cardsPerAxis.x;
    const cardHeight = rootElBoundingRect.height / cardsPerAxis.y;
    const ratioPerAxis = {
      x: cardWidth / CARD_SIZE.width,
      y: cardHeight / CARD_SIZE.height
    };
    const minRatio = Math.min(ratioPerAxis.x, ratioPerAxis.y);

    const cardStyle = {
      width: CARD_SIZE.width * minRatio,
      height: CARD_SIZE.height * minRatio,
      offsetX: -limits.x.min,
      offsetY: -limits.y.min,
    };
    
    this.setState({
      cardStyle,
      innerWidth: cardsPerAxis.x * CARD_SIZE.width * minRatio,
      innerHeight: cardsPerAxis.y * CARD_SIZE.height * minRatio,
    });
  }

  componentDidMount() {
    this.updateSize();
  }

  componentWillReceiveProps() {
    this.updateSize();
  }

  render() {
    return (
      <div className="board">
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize.bind(this)} />
        { this.state.innerWidth && 
          <div className="board__inner" style={computeInnerStyle(this.state)}>
            { this.state.cardStyle && this.props.slots && this.props.slots.map(slot =>
            <BoardSlot slot={slot} key={slot.x + ':' + slot.y} cardStyle={this.state.cardStyle}/>
          )}
        </div>
      }
      </div>
    );
  }
}