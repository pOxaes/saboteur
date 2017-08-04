import Velocity from "velocity-animate";
import { getCard, setStyle } from "./utils.animation";

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
    let card = getCard(container, cardId, playerId);
    if (!card) {
      resolve();
      return;
    }
    const cardBCR = card.getBoundingClientRect();
    setStyle(card, {
      position: "fixed",
      top: `${cardBCR.top}px`,
      left: `${cardBCR.left}px`
    });
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
