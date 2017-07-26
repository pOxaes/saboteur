const http = require("http");
const io = require("socket.io");
const logger = require("./logger");
const userService = require("./services/user");
// const websocketService = require('./services/websocket.service');
// const authorizationService = require('./services/authorization.service');

const init = app => {
  const server = http.createServer(app);
  const wss = io(server);
  wss.on("connection", ws => {
    console.log("connection", ws.handshake.query.token);
    userService.getTokenPayload(ws.handshake.query.token).then(({ email }) => {
      logger.info(`${email} is connected to ws`);
      ws.emit("CONNECTED");
    });
    // authorizationService.checkToken(ws.handshake.query.token)
    // .then((user) => {
    //   logger.info(`${user.type} ${user.id} is connected to ws`);
    //   websocketService.addClient(ws, user);
    //   ws.on('message', websocketService.on.bind(null, {
    //     ws,
    //     type: user.type,
    //     _id: user.id,
    //   }));
    // })
    // .catch(() => {
    //   ws.disconnect('unauthorized');
    // });
  });
  const port = parseInt(process.env.API_PORT, 10);
  server.listen(port);
  logger.info(`API Server running at http://localhost:${port}`);
};

module.exports = {
  init
};
