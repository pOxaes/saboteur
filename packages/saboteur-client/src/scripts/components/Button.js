import React from "react";
import "../../styles/Button.css";

const computeButtonClass = (modifiers = {}) =>
  [
    "button",
    modifiers.small && "button--small",
    modifiers.verySmall && "button--very-small",
    modifiers.square && "button--square",
    modifiers.warning && "button--warning"
  ].join(" ");

export default ({ onClick, type, text, modifiers }) =>
  <button
    className={computeButtonClass(modifiers)}
    type={type || "button"}
    onClick={onClick}
  >
    {text}
  </button>;
