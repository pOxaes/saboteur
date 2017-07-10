import React from 'react';

export default ({ game, onClick }) => {
  return (
      <button className="game" onClick={() => onClick(game)}>
        <span className="game__name">{ game.name }</span>
      </button>
    );
};
