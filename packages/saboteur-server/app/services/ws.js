const Promise = require("bluebird");
const utils = require("saboteur-shared/utils");
const logger = require("../logger");

const clients = {};

const forEachClient = cb => Object.values(clients).forEach(cb);

const trigger = (event, data) => {
  logger.info(`${event} event triggered`);
  forEachClient(ws => {
    ws.emit(event, data);
  });
};

const throwError = message => {
  const error = new Error();
  error.message = message;
  return error;
};

const listenEmittedEvent = (ws, actions, events) => {
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

const add = (ws, actions, events) => {
  console.log("add");
  clients[ws.id] = ws;
  listenEmittedEvent(ws, actions, events);
  ws.on("disconnect", () => {
    delete clients[ws.id];
  });
};

module.exports = {
  add,
  listenEmittedEvent,
  trigger
};
