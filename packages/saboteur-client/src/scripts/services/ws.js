import io from "socket.io-client";
import events from "saboteur-shared/events";

const TIMEOUT_DURATION = 3000;

let socket;
let connected = false;

const isConnected = () => !!connected;

const disconnect = () => {
  if (socket) {
    socket.disconnect();
  }
};

const trigger = (type, payload) =>
  socket.send({
    type,
    payload
  });

const attachDispatcher = (ws, store) => {
  Object.values(events).forEach(event => {
    // ws.on(event, payload => {
    // console.log("message received", event, payload);
    // store.commit(types[typeKey], payload);
    // });
  });
};

const emit = (command, data) => {
  socket.emit(command, data);
};

const emitPromise = (command, data) =>
  new Promise((resolve, reject) => {
    socket.emit(command, data, response => {
      if (typeof response === "object") {
        if (response.success) {
          resolve(response.data);
        } else {
          reject(
            typeof response.message === "string"
              ? response.message
              : "The request was not successful."
          );
        }
      } else {
        reject("The response to your request could not be parsed.");
      }
    });
    setTimeout(() => {
      reject("The request took too long to respond.");
    }, TIMEOUT_DURATION);
  });

const connect = token =>
  new Promise((resolve, reject) => {
    connected = false;
    socket = io(`ws://localhost:3020?token=${token}`);
    socket.on("disconnect", message => {
      if (connected) {
        return;
      }
      reject(!!message);
    });
    socket.on("CONNECTED", user => {
      connected = true;
      resolve({ user, ws: socket });
      attachDispatcher(socket);
    });
  });

export default {
  connect,
  disconnect,
  emit,
  emitPromise,
  isConnected,
  trigger
};
