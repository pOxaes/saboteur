import React from "react";
import Card from "./Card";
import PlayerStatus from "./PlayerStatus";
import "../../styles/Player.css";

const computePlayerClass = (player, direction) =>
  [
    "player",
    `player--direction-${direction}`,
    player.isHighlighted && "player--highlighted",
  ].join(" ");

export default ({ player, kick, canKick, direction, onClick }) =>
  <div className={computePlayerClass(player, direction)} >
    {canKick &&
      <button type="button" onClick={() => kick(player)}>
        kick
      </button>}
    <div onClick={() => {
      onClick && onClick(player);
    }}>
      <PlayerStatus player={player} direction={direction} />
    </div>
    { direction ?
      <div className="player__cards">
        {player.cards &&
          player.cards.map((card, index) => (
            <div className="player__cards__card-wrapper" key={index}>
              <Card card={card}  modifiers={{ isPlayer: true }}/>
            </div>))}
      </div> : <div className="player__cards">{player.cards && player.cards.length}</div>
    }
  </div>;
