import React from "react";
import gameRules from "saboteur-shared/dist/game";
import Board from "./Board";
import Deck from "./Deck";
import Discard from "./Discard";

export default ({
  slots,
  game,
  confirmSelectedCardDestination,
  hasSelectedCard
}) =>
  <div>
    <Board
      slots={slots}
      selectSlot={confirmSelectedCardDestination.bind(
        this,
        gameRules.DESTINATION_TYPES.SLOT
      )}
    />
    <Deck count={game.deck} />
    <Discard
      highlight={hasSelectedCard}
      onDiscard={confirmSelectedCardDestination.bind(
        this,
        gameRules.DESTINATION_TYPES.DISCARD
      )}
    />
  </div>;
