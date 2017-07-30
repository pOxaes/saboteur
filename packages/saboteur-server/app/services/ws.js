const Promise = require("bluebird");
const utils = require("saboteur-shared/utils");
const logger = require("../logger");

const events = require("saboteur-shared/events");
const actions = require("../actions");

const trigger = (eventType, data) => {
  logger.info(`${eventType} event triggered`);
  actions[eventType](data);
};

const throwError = message => {
  const error = new Error();
  error.message = message;
  return error;
};

const listenEmittedEvent = ws => {
  Object.values(events).forEach(event => {
    ws.on(event, (payload, setValueResult) => {
      logger.info(`${event} event received from ${ws} ${ws.userId}`);
      const action = actions[event]({ trigger, ws }, payload);
      if (!utils.isPromise(action)) {
        return;
      }
      action
        .then(data => {
          setValueResult({
            success: true,
            data
          });
        })
        .catch(message => {
          logger.error(
            JSON.stringify({
              userId: ws.userId,
              event,
              payload,
              message
            })
          );
          setValueResult({
            success: false,
            message
          });
        });
    });
  });
};

module.exports = {
  listenEmittedEvent,
  trigger
};
