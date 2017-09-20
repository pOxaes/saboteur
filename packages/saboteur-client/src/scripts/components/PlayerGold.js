import React, { Component } from "react";
import PropTypes from "prop-types";
import GoldSvg from "./GoldSvg";
import "../../styles/PlayerGold.css";

const goldToArray = gold =>
  gold.reduce((acc, goldValue) => {
    const arr = [];
    for (var i = 0; i < goldValue; i++) {
      arr.push("");
    }
    return acc.concat(arr);
  }, []);

class PlayerGold extends Component {
  state = {
    flattenedGold: []
  };

  componentWillMount() {
    this.setState({
      flattenedGold: goldToArray(this.props.gold)
    });
  }

  render() {
    return (
      <div className="player-gold">
        {this.state.flattenedGold.length > 4
          ? <div>
              <div className="player-gold__text">
                {this.state.flattenedGold.length}
              </div>
              <GoldSvg index={0} />
            </div>
          : this.state.flattenedGold.map((goldValue, index) =>
              <GoldSvg key={index} />
            )}
      </div>
    );
  }
}

PlayerGold.propTypes = {
  gold: PropTypes.array.isRequired
};

PlayerGold.defaultProps = {
  gold: []
};

export default PlayerGold;
