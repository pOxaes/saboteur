import React from "react";
import "../../styles/DoubleColorTitle.css";

export default ({ text }) =>
  <span className="double-color-title">
    {text}
    <span className="double-color-title__inner">
      <span className="double-color-title__text-container double-color-title__top">
        <span className="double-color-title__text">
          {text}
        </span>
      </span>
      <span className="double-color-title__text-container double-color-title__bottom">
        <span className="double-color-title__text">
          {text}
        </span>
      </span>
    </span>
  </span>;
