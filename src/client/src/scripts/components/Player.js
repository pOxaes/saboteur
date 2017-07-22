import React from "react";
import Card from "./Card";
import PlayerStatus from "./PlayerStatus";
import "../../styles/Player.css";

const computePlayerClass = (direction) =>
  [
    "player",
    `player--direction-${direction}`
  ].join(" ");

export default ({ player, kick, canKick, direction }) =>
  <div className={computePlayerClass(direction)} >
    {canKick &&
      <button type="button" onClick={() => kick(player)}>
        kick
      </button>}
    <PlayerStatus player={player} direction={direction} />
    { direction ?
      <div className="player__cards">
        {player.cards &&
          player.cards.map((card, index) => (
            <div className="player__cards__card-wrapper" key={index}>
              <Card card={card}  modifiers={{ isPlayer: true }}/>
            </div>))}
      </div> : <div className="player__cards">{player.cards.length}</div>
    }
  </div>;
