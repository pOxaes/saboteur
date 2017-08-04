import Velocity from "velocity-animate";
// import { findDOMNode } from "react-dom";

// TODO: SO MUCH REFACTO NEEDED
// SO MUCH WOW

const toDiscard = async (container, el) =>
  new Promise((resolve, reject) => {
    const discardEl = container.querySelector("#discard");
    const discardBCR = discardEl.getBoundingClientRect();
    Velocity(
      el,
      {
        top: discardBCR.top,
        left: discardBCR.left
      },
      {
        delay: 500,
        duration: 300,
        complete: resolve
      }
    );
  });

const discard = async (container, cardId, playerId) =>
  new Promise((resolve, reject) => {
    const viewBCR = document.body.getBoundingClientRect();
    let card = container.querySelector(`#card-${cardId}`);
    if (!card) {
      const player = container.querySelector(`#player-${playerId}`);
      card = player.querySelector(`.player__cards__card-wrapper`);
    }
    const cardBCR = card.getBoundingClientRect();
    card.style.position = "fixed";
    card.style.top = cardBCR.top + "px";
    card.style.left = cardBCR.left + "px";
    Velocity(
      card,
      {
        top: viewBCR.height / 2 - cardBCR.height / 2,
        left: viewBCR.width / 2 - cardBCR.width / 2
      },
      {
        duration: 300,
        complete: () => {
          toDiscard(container, card).then(() => {
            card.removeAttribute("style");
            resolve();
          });
        }
      }
    );
  });

export default {
  discard
};
