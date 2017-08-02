require("dotenv").config({
  path: __dirname + "/.env"
});

const express = require("express");
const cors = require("cors");
const path = require("path");
const noCache = require("nocache");
const requestLogger = require("winston-request-logger");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const websocketServer = require("./app/websocketServer");
const routes = require("./app/routes");
const logger = require("./app/logger");

const app = express();

app.use(express.static(path.join(__dirname, process.env.DIST_PATH)));

app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(
  path.join(process.env.ROUTE_BASE, "/api"),
  noCache(),
  cors({
    credentials: true,
    origin: [process.env.CORS_ORIGIN],
    allowedHeaders: ["Content-Type"]
  }),
  requestLogger.create(logger),
  routes
);

websocketServer.init(app);
