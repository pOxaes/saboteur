import React, { Component } from "react";
import ReactDOM from "react-dom";

const drawGold = ({svg, x, y}) => {
  const gold = document.createElementNS(svg.namespaceURI, "circle");
  gold.setAttribute("cx", x);
  gold.setAttribute("cy", y);
  gold.setAttribute("r", 8);
  gold.setAttribute("fill", "#FFDD33");
  svg.appendChild(gold);
};

const drawRock = ({svg, x, y}) => {
  const rock = document.createElementNS(svg.namespaceURI, "circle");
  rock.setAttribute("cx", x);
  rock.setAttribute("cy", y);
  rock.setAttribute("r", 15);
  rock.setAttribute("fill", "#888888");
  svg.appendChild(rock);
};

const drawLadder = ({svg, x, y}) => {
  const ladder = document.createElementNS(svg.namespaceURI, "rect");
};

export default class CardLayout extends Component {
  componentDidMount() {
    const rootEl = ReactDOM.findDOMNode(this);
    const rootElClientRect = rootEl.getBoundingClientRect();

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const svgNS = svg.namespaceURI;
    const pathWidth = rootElClientRect.width / 3;
    
    svg.setAttribute("height", rootElClientRect.height);
    svg.setAttribute("width", rootElClientRect.width);

    this.props.layout.toString().split("").forEach((isOpen, index) => {
      if (isOpen === "1") {
        const rect = document.createElementNS(svgNS, "rect");
        switch (index) {
          case 0:
          case 2:
            rect.setAttribute("x", rootElClientRect.width / 2 - pathWidth / 2);
            rect.setAttribute("y", (index / 2) * rootElClientRect.height / 2);
            rect.setAttribute("width", pathWidth);
            rect.setAttribute("height", rootElClientRect.height / 2);
            break;
          case 1:
          case 3:
            rect.setAttribute("x", (index - 1) / 2 * rootElClientRect.width / 2);
            rect.setAttribute("y", rootElClientRect.height / 2 - pathWidth / 2);
            rect.setAttribute("width", rootElClientRect.width / 2);
            rect.setAttribute("height", pathWidth);
            break;
        }
        rect.setAttribute("fill", "#95B3D7");
        svg.appendChild(rect);
      }
    });

    const itemCtx = {
      svg,
      x: rootElClientRect.width / 2,
      y: rootElClientRect.height / 2
    };

    switch (this.props.item) {
      case "GOLD":
        drawGold(itemCtx);
      break;
      case "ROCK":
        drawRock(itemCtx);
      break;
      case "LADDER":
        drawLadder(itemCtx);
      break;
    }

    if (this.props.item) {
      console.log('create item', this.props.item);
    }

    rootEl.appendChild(svg);
  }

  render() {
    return (
      <div className="card__layout"></div>
    );
  }
}