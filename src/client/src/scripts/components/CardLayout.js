import React, { Component } from "react";
import "../../styles/SvgCardPath.css";

export default class CardLayout extends Component {
  state = {
    top: this.props.layout[0] === "1",
    right: this.props.layout[1] === "1",
    bottom: this.props.layout[2] === "1",
    left: this.props.layout[3] === "1",
  };

  render() {
    return (
      <svg version="1.1" className="svg-card-path" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  viewBox="0 0 126 176" xmlSpace="preserve">
        { this.state.left &&
          <path className="svg-card-path__path--left" d="M43,88L43,88c0,13.1-10.6,23.6-23.7,23.7H0V64.3h19.3C32.4,64.4,43,74.9,43,88z" /> }
        { this.state.bottom &&
          <path className="svg-card-path__path--bottom" d="M63,108L63,108c13.1,0,23.6,10.6,23.7,23.7V176H39.3v-44.3C39.4,118.6,49.9,108,63,108z" /> }
        { this.state.right &&
          <path className="svg-card-path__path--right" d="M83,88L83,88c0-13.1,10.6-23.6,23.7-23.7H126v47.3h-19.3C93.6,111.6,83,101.1,83,88z" /> }
        { this.state.top &&
          <path className="svg-card-path__path--top" d="M63,68L63,68c-13.1,0-23.6-10.6-23.7-23.7V0h47.3v44.3C86.6,57.4,76.1,68,63,68z" /> }
        { this.state.top && this.state.right &&
          <path className="svg-card-path__path--top svg-card-path__path--right" d="M39.3,44.3c0,56.3,11,67.3,67.3,67.3V64.3c-13.5,0-20-8.2-20-20H39.3z" /> }
        { this.state.bottom && this.state.right &&
          <path className="svg-card-path__path--bottom svg-card-path__path--right" d="M106.7,64.3c-56.3,0-67.3,11-67.3,67.3h47.3c0-13.5,8.2-20,20-20V64.3z" /> }
        { this.state.top && this.state.left &&
          <path className="svg-card-path__path--top svg-card-path__path--left" d="M19.3,111.7c56.3,0,67.3-11,67.3-67.3H39.3c0,13.5-8.2,20-20,20V111.7z" /> }
        { this.state.bottom && this.state.left && 
          <path className="svg-card-path__path--bottom svg-card-path__path--left" d="M86.7,131.7c0-56.3-11-67.3-67.3-67.3v47.3c13.5,0,20,8.2,20,20H86.7z" /> }
        { this.state.top && this.state.bottom &&
          <rect className="svg-card-path__path--top svg-card-path__path--bottom" x="39.3" y="44.3" width="47.3" height="87.3" /> }
        { this.state.right && this.state.left &&
          <rect className="svg-card-path__path--left svg-card-path__path--right" x="19.3" y="64.3" width="87.3" height="47.3" /> }
        
        { this.props.item === 'ROCK' &&
          <g className="svg-card-path__item--rock">
            <path className="rock-color-1" d="M73.3,36.8c10,2.3,31,25.3,12.8,56.5s-58.4,25.8-65.4,17.2s-8.4-22.7,7-42S66.6,35.3,73.3,36.8z" />
            <path className="rock-color-2" d="M80.1,79.6c7.7,0.9,17.6,11.3,16.2,28.8c-1.3,17.5-20,19.2-30,17.3s-23.8-3.9-23.1-10.7
            c0.6-6.8,6.9-21.5,16.4-27.1S71.8,78.6,80.1,79.6z" />
          </g> }

        { this.props.item === 'GOLD' &&
          <g className="svg-card-path__item--gold">
            <path className="gold-color-1" d="M60.8,99.2c1.4,0.2,2.3-0.7,2.8-3.5c0.5-2.8,0.8-4.7,1.1-6.7c0.3-2,0.1-3.1-2.2-6c-2.3-2.9-2.9-3.1-5.7-5.9
            c-2.2-2.2-3.6-4.3-5.1-4.6c-0.3,0.1-0.5,0.2-0.7,0.4c-1.5,1.1-2.8,3.9-2.8,3.9s-3.6,6.1-6.7,12.2c-0.9,2.2-1.2,3.3-1.1,4.1
            c1.5,0.6,4.9,2.1,9.4,3.3C55.8,98,58.7,98.7,60.8,99.2z" />
            <path className="gold-color-2" d="M60.8,99.2c-2.2-0.5-5.1-1.2-11.1-2.9c-4.5-1.3-7.9-2.7-9.4-3.3c0.2,1,1,1.6,2,3.1c3.3,3.3,5.7,5.6,7.4,6.8
            c1.5,1.2,4.3,1.9,10.9,1.7c1.1-0.1,2.2-0.2,3.3-0.3l-1.8-5.3C61.8,99.2,61.3,99.3,60.8,99.2z" />
            <path className="gold-color-3" d="M65.9,87.8c1.1,0.2,10.9,2.4,14.1,3c-0.2-1.6-1.7-2.6-3.4-4.1c-1.8-1.6-12.2-8.5-17.5-11.6
            c-3.4-2-5.7-3.2-7.3-2.8c1.5,0.3,2.9,2.4,5.1,4.6c2.8,2.8,3.4,3,5.7,5.9c2.2,2.8,2.4,4,2.2,5.8C64.9,88.2,65.2,87.7,65.9,87.8z"
            />
            <path className="gold-color-4" d="M80,90.9c-3.1-0.7-13-2.8-14.1-3c-0.7-0.1-1,0.4-1.2,0.9c0,0.1,0,0.1,0,0.2c-0.3,2-0.5,3.9-1.1,6.7
            c-0.3,1.8-0.8,2.8-1.5,3.2l1.8,5.3c4-0.5,8-1.6,11.2-2.2c3.6-0.8,3.9-1.8,4.4-4.6c0.5-2.8,0.5-4.6,0.4-6.4C80,91,80,91,80,90.9z"
            />
          </g> }
        
        { this.props.item === 'LADDER' &&
          <g className="svg-card-path__item--ladder">
            <ellipse cx="63" cy="88" rx="12.5" ry="7.8" />
            <path className="ladder-color-1" d="M56.5,69l0.7-0.4l2.7,0.2l7.6,26.6c-1.3,0.3-2.7,0.5-3.5,0.5L56.5,69z" />
            <path className="ladder-color-2" d="M52.2,76.4l6.5-3.4c0,0,0.3-0.1,0.5,0.2s0.1,0.7,0.1,0.7l-6.7,3.5L52.2,76.4z" />
            <path className="ladder-color-2" d="M53.8,82.1l6.5-3.4c0,0,0.3-0.1,0.5,0.2s0.1,0.7,0.1,0.7l-6.7,3.5L53.8,82.1z" />
            <path className="ladder-color-2" d="M55.3,87.9l6.5-3.4c0,0,0.3-0.1,0.5,0.2s0.1,0.7,0.1,0.7l-6.7,3.5L55.3,87.9z" />
            <path className="ladder-color-2" d="M56.7,93.5l6.5-3.4c0,0,0.3-0.1,0.5,0.2s0.1,0.7,0.1,0.7L57,94.6L56.7,93.5z" />
            <path className="ladder-color-3" d="M48,73.7l0.7-0.4l2.7,0.2l6.1,21.6c-1.4-0.5-2.7-0.9-4.2-2.1L48,73.7z" />
          </g> }
      </svg>
    );
  }
}



// <?xml version="1.0" encoding="utf-8"?>
// <!-- Generator: Adobe Illustrator 21.0.2, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
// <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
// 	 viewBox="0 0 126 176" style="enable-background:new 0 0 126 176;" xml:space="preserve">
// <style type="text/css">
// 	.st0{fill:#FFFFFF;}
// 	.st1{fill:#545452;}
// 	.st2{fill:#686867;}
// 	.st3{fill:#FFD255;}
// 	.st4{fill:#FFC70C;}
// 	.st5{fill:#FFF2CF;}
// 	.st6{fill:#FFE69F;}
// 	.st7{fill:#AA0C00;}
// 	.st8{fill:#D11900;}
// 	.st9{fill:#E81B00;}
// </style>
// <path id="left" className="st0" d="M43,88L43,88c0,13.1-10.6,23.6-23.7,23.7H0V64.3h19.3C32.4,64.4,43,74.9,43,88z"/>
// <path id="bottom" className="st0" d="M63,108L63,108c13.1,0,23.6,10.6,23.7,23.7V176H39.3v-44.3C39.4,118.6,49.9,108,63,108z"/>
// <path id="right" className="st0" d="M83,88L83,88c0-13.1,10.6-23.6,23.7-23.7H126v47.3h-19.3C93.6,111.6,83,101.1,83,88z"/>
// <path id="top" className="st0" d="M63,68L63,68c-13.1,0-23.6-10.6-23.7-23.7V0h47.3v44.3C86.6,57.4,76.1,68,63,68z"/>
// <path id="top-right" className="st0" d="M39.3,44.3c0,56.3,11,67.3,67.3,67.3V64.3c-13.5,0-20-8.2-20-20H39.3z"/>
// <path id="bottom-right" className="st0" d="M106.7,64.3c-56.3,0-67.3,11-67.3,67.3h47.3c0-13.5,8.2-20,20-20V64.3z"/>
// <path id="top-left" className="st0" d="M19.3,111.7c56.3,0,67.3-11,67.3-67.3H39.3c0,13.5-8.2,20-20,20V111.7z"/>
// <path id="bottom-left_1_" className="st0" d="M86.7,131.7c0-56.3-11-67.3-67.3-67.3v47.3c13.5,0,20,8.2,20,20H86.7z"/>
// <rect id="top-bottom" x="39.3" y="44.3" className="st0" width="47.3" height="87.3"/>
// <rect id="left-right" x="19.3" y="64.3" className="st0" width="87.3" height="47.3"/>
// <g id="rock">
// 	<path className="st1" d="M73.3,36.8c10,2.3,31,25.3,12.8,56.5s-58.4,25.8-65.4,17.2s-8.4-22.7,7-42S66.6,35.3,73.3,36.8z"/>
// 	<path className="st2" d="M80.1,79.6c7.7,0.9,17.6,11.3,16.2,28.8c-1.3,17.5-20,19.2-30,17.3s-23.8-3.9-23.1-10.7
// 		c0.6-6.8,6.9-21.5,16.4-27.1S71.8,78.6,80.1,79.6z"/>
// </g>
// <g id="gold">
// 	<path className="st3" d="M60.8,99.2c1.4,0.2,2.3-0.7,2.8-3.5c0.5-2.8,0.8-4.7,1.1-6.7c0.3-2,0.1-3.1-2.2-6c-2.3-2.9-2.9-3.1-5.7-5.9
// 		c-2.2-2.2-3.6-4.3-5.1-4.6c-0.3,0.1-0.5,0.2-0.7,0.4c-1.5,1.1-2.8,3.9-2.8,3.9s-3.6,6.1-6.7,12.2c-0.9,2.2-1.2,3.3-1.1,4.1
// 		c1.5,0.6,4.9,2.1,9.4,3.3C55.8,98,58.7,98.7,60.8,99.2z"/>
// 	<path className="st4" d="M60.8,99.2c-2.2-0.5-5.1-1.2-11.1-2.9c-4.5-1.3-7.9-2.7-9.4-3.3c0.2,1,1,1.6,2,3.1c3.3,3.3,5.7,5.6,7.4,6.8
// 		c1.5,1.2,4.3,1.9,10.9,1.7c1.1-0.1,2.2-0.2,3.3-0.3l-1.8-5.3C61.8,99.2,61.3,99.3,60.8,99.2z"/>
// 	<path className="st5" d="M65.9,87.8c1.1,0.2,10.9,2.4,14.1,3c-0.2-1.6-1.7-2.6-3.4-4.1c-1.8-1.6-12.2-8.5-17.5-11.6
// 		c-3.4-2-5.7-3.2-7.3-2.8c1.5,0.3,2.9,2.4,5.1,4.6c2.8,2.8,3.4,3,5.7,5.9c2.2,2.8,2.4,4,2.2,5.8C64.9,88.2,65.2,87.7,65.9,87.8z"/>
// 	<path className="st6" d="M80,90.9c-3.1-0.7-13-2.8-14.1-3c-0.7-0.1-1,0.4-1.2,0.9c0,0.1,0,0.1,0,0.2c-0.3,2-0.5,3.9-1.1,6.7
// 		c-0.3,1.8-0.8,2.8-1.5,3.2l1.8,5.3c4-0.5,8-1.6,11.2-2.2c3.6-0.8,3.9-1.8,4.4-4.6c0.5-2.8,0.5-4.6,0.4-6.4C80,91,80,91,80,90.9z"/>
// </g>
// <g id="ladder">
// 	<ellipse cx="63" cy="88" rx="12.5" ry="7.8"/>
// 	<path className="st7" d="M56.5,69l0.7-0.4l2.7,0.2l7.6,26.6c-1.3,0.3-2.7,0.5-3.5,0.5L56.5,69z"/>
// 	<path className="st8" d="M52.2,76.4l6.5-3.4c0,0,0.3-0.1,0.5,0.2s0.1,0.7,0.1,0.7l-6.7,3.5L52.2,76.4z"/>
// 	<path className="st8" d="M53.8,82.1l6.5-3.4c0,0,0.3-0.1,0.5,0.2s0.1,0.7,0.1,0.7l-6.7,3.5L53.8,82.1z"/>
// 	<path className="st8" d="M55.3,87.9l6.5-3.4c0,0,0.3-0.1,0.5,0.2s0.1,0.7,0.1,0.7l-6.7,3.5L55.3,87.9z"/>
// 	<path className="st8" d="M56.7,93.5l6.5-3.4c0,0,0.3-0.1,0.5,0.2s0.1,0.7,0.1,0.7L57,94.6L56.7,93.5z"/>
// 	<path className="st9" d="M48,73.7l0.7-0.4l2.7,0.2l6.1,21.6c-1.4-0.5-2.7-0.9-4.2-2.1L48,73.7z"/>
// </g>
// </svg>
