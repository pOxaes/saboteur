const http = require("http");
const io = require("socket.io");
const logger = require("./logger");
const userService = require("./services/user");
const events = require("./events");
const wsService = require("./services/ws");

const init = app => {
  const server = http.createServer(app);
  const wss = io(server);
  wss.on("connection", ws => {
    userService
      .getTokenPayload(ws.handshake.query.token)
      .then(({ email, name, id }) => {
        logger.info(`${email} ${id} is connected to ws`);
        ws.userId = id;
        ws.emit("CONNECTED", { email, name, id });
        wsService.listenEmittedEvent(ws);
        ws.on("message", payload => {
          console.log("message", payload);
        });
      })
      .catch(() => {
        ws.disconnect("unauthorized");
      });
  });
  const port = parseInt(process.env.API_PORT, 10);
  server.listen(port);
  logger.info(`API Server running at http://localhost:${port}`);
};

module.exports = {
  init
};
