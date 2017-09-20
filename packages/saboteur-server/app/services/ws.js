const utils = require("saboteur-shared/src/utils");
const logger = require("../logger");

const clients = {};

const forEachClient = cb => Object.values(clients).forEach(cb);

function trigger(event, data, clientIds) {
  logger.info(`${event} event triggered`, clientIds);
  if (clientIds) {
    Object.values(clients)
      .filter(ws => clientIds.indexOf(ws.userId) !== -1)
      .forEach(ws => ws.emit(event, data));
  } else {
    forEachClient(ws => {
      ws.emit(event, data);
    });
  }
}

function listenEmittedEvent(ws, actions, events) {
  Object.values(events).forEach(event => {
    ws.on(event, async (payload, setValueResult) => {
      logger.info(`${event} event received from ${ws} ${ws.userId}`);
      const action = actions[event]({ trigger, ws }, payload);
      if (!utils.isPromise(action) || !setValueResult) {
        return;
      }
      try {
        const data = await action;
        setValueResult({
          success: true,
          data
        });
      } catch (message) {
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
      }
    });
  });
}

function add(ws, actions, events) {
  clients[ws.id] = ws;
  listenEmittedEvent(ws, actions, events);
  ws.on("disconnect", () => {
    delete clients[ws.id];
  });
}

module.exports = {
  add,
  listenEmittedEvent,
  trigger
};
