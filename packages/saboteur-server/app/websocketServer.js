const http = require("http");
const io = require("socket.io");
const logger = require("./logger");
const userService = require("./services/user");
const events = require("saboteur-shared/src/events");
const actions = require("./actions");
const wsService = require("./services/ws");

const init = app => {
  const server = http.createServer(app);
  const wss = io(server);
  wss.on("connection", async ws => {
    try {
      const { id } = await userService.getTokenPayload(
        ws.handshake.query.token
      );
      const user = await userService.getById(id);
      if (!user) {
        throw Error("403");
      }
      const { email, name, avatarUrl } = user;
      logger.info(`${email} ${id} is connected to ws`);
      ws.userId = id;
      ws.emit("CONNECTED", { email, name, id, avatarUrl });
      wsService.add(ws, actions, events);
    } catch (err) {
      logger.error(err, "user from token payload does not exist");
      ws.disconnect("unauthorized");
    }
  });
  const port = parseInt(process.env.API_PORT, 10);
  server.listen(port);
  logger.info(`API Server running at http://localhost:${port}`);
};

module.exports = {
  init
};
