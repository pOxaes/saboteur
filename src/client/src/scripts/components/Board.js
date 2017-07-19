import React, { Component } from "react";
import ReactDOM from 'react-dom';
import BoardSlot from "./BoardSlot";
import ReactResizeDetector from 'react-resize-detector';
import boardService from "../services/board";
import "../../styles/Board.css";

const RESIZE_THROTTLE_TIME = 300;

const CARD_SIZE = {
  width: 63,
  height: 88,
};

const boardItemToCard = ({ layout, item }) => ({
  layout,
  item,
  type: "PATH",
});

const findSlot = (slots, x, y) => slots.find(slot => slot.x === x && slot.y === y);

const updateSlot = (slots, x, y, card, shouldForce) => {
  const existingSlot = findSlot(slots, x, y);
  if (existingSlot && (!existingSlot.card || shouldForce)) {
    existingSlot.card = card;
  } else if (!existingSlot) {
    const newSlot = {
      x,
      y,
      card,
    };
    slots.push(newSlot);
  }  
}

const withLink = (card, index, cards) => {
  return Object.assign({
    isLinkedToStart: boardService.isLinkedToStart(card, cards),
  }, card);
}

const createSlotsFromCards = cards => cards.reduce((slots, card) => {
  updateSlot(slots, card.x, card.y, boardItemToCard(card));
  if (card.layout && card.isLinkedToStart) {
    if (card.layout.top) {
      updateSlot(slots, card.x, card.y - 1);
    }
    if (card.layout.bottom) {
      updateSlot(slots, card.x, card.y + 1);
    }
    if (card.layout.left) {
      updateSlot(slots, card.x - 1, card.y);
    }
    if (card.layout.right) {
      updateSlot(slots, card.x + 1, card.y);
    }
  }
  return slots;
}, []);

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

const getCardsPerAxisFromSlots = (slots, limits) => {
  return Object.keys(limits).reduce((size, axis) => {
    size[axis] = Math.abs(limits[axis].min) + Math.abs(limits[axis].max) + 1;
    return size;
  }, {});
}

const computeInnerStyle = ({ innerHeight, innerWidth }) => ({
  width: innerWidth,
  height: innerHeight,
});

export default class CardLayout extends Component {
  state = {
    slots: createSlotsFromCards(this.props.cards.map(withLink)),
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
    const limits = getLimitsFromSlots(this.state.slots);

    const cardsPerAxis = getCardsPerAxisFromSlots(this.state.slots, limits);
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
    this.setState({
      slots: createSlotsFromCards(this.props.cards.map(withLink)),
    });
  }

  render() {
    return (
      <div className="board">
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize.bind(this)} />
        { this.state.innerWidth && 
          <div className="board__inner" style={computeInnerStyle(this.state)}>
            { this.state.cardStyle && this.state.slots && this.state.slots.map(slot =>
            <BoardSlot slot={slot} key={slot.x + ':' + slot.y} cardStyle={this.state.cardStyle}/>
          )}
        </div>
      }
      </div>
    );
  }
}