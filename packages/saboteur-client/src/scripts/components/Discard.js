import React from "react";
import "../../styles/Discard.css";

export default ({ onDiscard }) =>
  <div
    className="discard"
    id="discard"
    onClick={() => {
      onDiscard && onDiscard();
    }}
  />;
