import React from "react";
import Card from "./Card";

const computeStyle = ({x, y}) => ({
  left: `${x * 63}px`,
  top: `${y * 88}px`,
});

const computeSlotClass = slot => 
  [
    "board__slot",
    !slot.card && `board__slot--no-card`,
  ].join(" ");

export default ({ slot }) =>
  <div className={computeSlotClass(slot)} style={computeStyle(slot)}>
    {slot.card && <Card card={slot.card} />}
  </div>