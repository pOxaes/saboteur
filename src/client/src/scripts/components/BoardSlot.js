import React from "react";
import Card from "./Card";

const computeStyle = ({x, y}, {width, height, offsetX, offsetY}) => {
  return {
    marginLeft: `${(x + offsetX) * width}px`,
    marginTop: `${(y + offsetY) * height}px`,
    width: `${width}px`,
    height: `${height}px`,
  };
};

const computeSlotClass = slot => 
  [
    "board__slot",
    !slot.card && `board__slot--no-card`,
  ].join(" ");

export default ({ slot, cardStyle }) =>
  <div className={computeSlotClass(slot)} style={computeStyle(slot, cardStyle)}>
    {slot.card && <Card card={slot.card} />}
  </div>