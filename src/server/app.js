const express = require("express");
const cors = require("cors");
const path = require("path");
const noCache = require("nocache");
const requestLogger = require("winston-request-logger");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const websocketServer = require("./app/websocketServer");
const config = require("./config");
const routes = require("./app/routes");
const logger = require("./app/logger");

const app = express();

app.use(config.server.routeBase, express.static(config.dist));
app.use("/", express.static(config.dist));

// const mock = filePath => (req, res) => {
//   console.log(`request file ${filePath}`);
//   const absPath = path.resolve(`../mocks/${filePath}.json`);
//   res.sendFile(absPath);
// };

// const fakeLatencyMiddleware = (req, res, next) => {
//   setTimeout(next, Math.random() * 300);
// };

// app.use(
//   cors({
//     origin: ["http://localhost:3002", "http://localhost:3000"]
//   }),
//   fakeLatencyMiddleware
// );

app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(
  path.join(config.server.routeBase, "/api"),
  noCache(),
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Content-Type"]
  }),
  requestLogger.create(logger),
  routes
);

// .get("/games", mock("games"))
// .post("/games", mock("game.lobby"))
// .post("/games/:id/kick", mock("game.playing"))
// .post("/games/:id/play", mock("game.playing"))
// .post("/games/:id/start", mock("game.playing"))
// .post("/games/:id/delete", mock("games"))
// .post("/games/:id/leave", mock("game.playing"))
// .get("/games/1", mock("game.lobby"))
// .get("/games/2", mock("game.completed"))
// .get("/games/:id", mock("game.playing"))
// .post("/login", mock("login"));

websocketServer.init(app);
