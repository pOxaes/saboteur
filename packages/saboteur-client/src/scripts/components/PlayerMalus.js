import React from "react";
import Card from "./Card";

const malusToCard = subtype => ({
  type: "ACTION",
  action: "BLOCK",
  subtype: [subtype]
});

export default ({ malus }) =>
  <div className="player-malus">
    {malus &&
      malus.map((malus, index) =>
        <Card
          card={malusToCard(malus)}
          key={index}
          modifiers={{ isMalus: true }}
        />
      )}
  </div>;
