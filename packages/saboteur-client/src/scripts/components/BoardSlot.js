import React from "react";
import Card from "./Card";

const computeStyle = ({ x, y }, { width, height, offsetX, offsetY }) => {
  return {
    marginLeft: `${(x + offsetX) * width}px`,
    marginTop: `${(y + offsetY) * height}px`,
    width: `${width}px`,
    height: `${height}px`
  };
};

const computeSlotClass = slot =>
  [
    "board__slot",
    !slot.card && `board__slot--no-card`,
    slot.isHighlighted && "board__slot--highlighted"
  ].join(" ");

export default ({ slot, cardStyle, onClick }) =>
  <div
    className={computeSlotClass(slot)}
    style={computeStyle(slot, cardStyle)}
    id={`slot_${slot.x}_${slot.y}`}
    onClick={() => {
      onClick && onClick(slot);
    }}
  >
    <div className="board__slot__inner">
      {slot.card && <Card card={slot.card} />}
    </div>
  </div>;
