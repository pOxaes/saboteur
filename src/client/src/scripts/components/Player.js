import React from "react";

import Card from "./Card";

export default ({ player, kick, canKick }) =>
  <div>
    {player.name}
    {canKick &&
      <button type="button" onClick={() => kick(player)}>
        kick
      </button>}
    {player.malus && player.malus.map((malus, index) => <Card card={malus} key={index} />)}
    {player.cards &&
      player.cards.map((card, index) => {
        <Card />;
      })}
  </div>;
