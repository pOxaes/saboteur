import React from "react";
import "../../styles/Discard.css";

export default ({ onDiscard }) =>
  <div
    className="discard"
    onClick={() => {
      onDiscard && onDiscard();
    }}
  />;
