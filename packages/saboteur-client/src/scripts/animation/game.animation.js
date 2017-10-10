import Velocity from "velocity-animate";
import {
  getCard,
  getNextSiblings,
  setStyle,
  clearStyle,
  ROTATE_START,
  ROTATE_STEP,
  MARGIN_BY_INDEX
} from "./utils.animation";

const toDiscard = async (container, el) =>
  new Promise((resolve, reject) => {
    const discardEl = container.querySelector("#discard");
    const discardBCR = discardEl.getBoundingClientRect();
    Velocity(
      el,
      {
        top: discardBCR.top + discardBCR.height / 2,
        left: discardBCR.left + discardBCR.width / 2,
        scale: 1
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
      left: `${cardBCR.left}px`,
      zIndex: 400
    });
    Velocity(
      card,
      {
        top: viewBCR.height / 2 - cardBCR.height / 2,
        left: viewBCR.width / 2 - cardBCR.width / 2,
        scale: 5
      },
      {
        duration: 300,
        complete: () => {
          toDiscard(container, card).then(() => {
            clearStyle(card);
            resolve();
          });
        }
      }
    );
  });

function repositionHandCard(card, index) {
  const cardIndex = parseInt(card.getAttribute("index"), 10);
  const currentRotateValue = ROTATE_START + ROTATE_STEP * cardIndex;
  const nextRotateValue = currentRotateValue - ROTATE_STEP;
  const marginTopValue = MARGIN_BY_INDEX[cardIndex - 1];

  Velocity(
    card,
    {
      rotateZ: [`${nextRotateValue}deg`, `${currentRotateValue}deg`],
      marginTop: `${marginTopValue}px`
    },
    {
      duration: 300
    }
  );
}

const discardForCurrentUser = async (container, cardId, playerId) =>
  new Promise((resolve, reject) => {
    const card = getCard(container, cardId, playerId);

    let nextCards = getNextSiblings(card.parentNode);
    nextCards.forEach(repositionHandCard);

    Velocity(
      card,
      { translateY: "300%", width: 34 },
      {
        duration: 300,
        complete: () => {
          resolve();
          clearStyle(card);
          nextCards.forEach(clearStyle);
        }
      }
    );
  });

export const onCardEnter = async (cardIndex, cardEl) =>
  new Promise((resolve, reject) => {
    const innerCard = cardEl.querySelector(".card__inner");
    Velocity(
      innerCard,
      {
        translateY: [0, "100%"]
      },
      {
        duration: 300,
        delay: 50 + cardIndex * 100,
        complete: () => {
          resolve();
          clearStyle(innerCard);
        }
      }
    );
  });

export const toCenter = async card =>
  new Promise((resolve, reject) => {
    const viewBCR = document.body.getBoundingClientRect();
    const cardBCR = card.getBoundingClientRect();
    setStyle(card, {
      position: "fixed",
      top: `${cardBCR.top}px`,
      left: `${cardBCR.left}px`,
      zIndex: 400
    });
    Velocity(
      card,
      {
        top: viewBCR.height / 2 - cardBCR.height / 2,
        left: viewBCR.width / 2 - cardBCR.width / 2,
        scale: 5
      },
      {
        duration: 300,
        complete: resolve
      }
    );
  });

export const moveCard = async (container, { destination, card }, playerId) =>
  new Promise((resolve, reject) => {
    return resolve();
    console.log(card);
    const cardEl = getCard(container, card.id, playerId);
    setTimeout(resolve, 10000);
    if (!cardEl) {
      return resolve();
    }
    console.log(cardEl);
    toCenter(cardEl);
  });

export default {
  discard,
  discardForCurrentUser,
  onCardEnter,
  moveCard
};
