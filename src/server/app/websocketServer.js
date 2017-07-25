const http = require("http");
const io = require("socket.io");
const config = require("../config");
const logger = require("./logger");
// const websocketService = require('./services/websocket.service');
// const authorizationService = require('./services/authorization.service');

const init = app => {
  const server = http.createServer(app);
  const wss = io(server);
  wss.on("connection", ws => {
    console.log("connection");
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
  server.listen(config.server.port);
  logger.info(`Server running on port ${config.server.port}`);
};

module.exports = {
  init
};
