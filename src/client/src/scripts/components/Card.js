import React from 'react';

export default ({ card, onClick }) => (
  <div className="card" onClick={() => { onClick && onClick(card) }}>
    { card } malus
  </div>
);
