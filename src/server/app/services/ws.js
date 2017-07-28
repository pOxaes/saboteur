const Promise = require("bluebird");
const logger = require("../logger");
const utils = require("./utils");

const events = require("../events");
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

// const emitPromise = (command, filters, data) =>
//   new Promise((resolve, reject) => {
//     const client = getClient(filters);
//     if (!client) {
//       return reject();
//     }

//     client.ws.emit(command, data || {}, response => {
//       if (typeof response === "object") {
//         if (response.success) {
//           resolve(response.data);
//         } else {
//           const message =
//             typeof response.message === "string"
//               ? response.message
//               : "The request was not successful.";
//           reject(throwError(message));
//         }
//       } else {
//         reject(throwError("The response to your request could not be parsed."));
//       }
//     });

//     return setTimeout(() => {
//       reject(throwError("The request took too long to respond."));
//     }, 3000);
//   });

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
          console.log("data", data);
          setValueResult({
            success: true,
            data
          });
        })
        .catch(message => {
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
