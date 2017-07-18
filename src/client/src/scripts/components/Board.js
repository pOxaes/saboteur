import React, { Component } from "react";
import BoardSlot from "./BoardSlot";
import "../../styles/Board.css";

const boardItemToCard = ({ layout, item }) => ({
  layout,
  item,
  type: "PATH",
});

const findSlot = (slots, x, y) => slots.find(slot => slot.x === x && slot.y === y);

const updateSlot = (slots, x, y, card, shouldForce) => {
  console.log('x, y', x, y);
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

const createSlotsFromCards = cards => cards.reduce((slots, card) => {
  updateSlot(slots, card.x, card.y, boardItemToCard(card));
  if (card.layout) {
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

export default class CardLayout extends Component {
  state = {
    slots: createSlotsFromCards(this.props.cards),
  };

  componentWillReceiveProps() {
    this.setState({
      slots: createSlotsFromCards(this.props.cards),
    });
  }

  render() {
    return (
      <div className="board">
        { this.state.slots && this.state.slots.map(slot =>
          <BoardSlot slot={slot} key={slot.x + ':' + slot.y}/>
        )}
      </div>
    );
  }
}