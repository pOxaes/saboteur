const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const mock = filePath => (req, res) => {
  console.log(`request file ${filePath}`);
  const absPath = path.resolve(`../mocks/${filePath}.json`);
  res.sendFile(absPath);
};

const fakeLatencyMiddleware = (req, res, next) => {
  setTimeout(next, Math.random() * 1500);
};

app.use(
  cors({
    origin: ["http://localhost:3002"]
  }),
  fakeLatencyMiddleware
);

app.get("/games", mock("games"));

app.get("/games/:id", mock("game.playing"));

app.listen(3008, function() {
  console.log("Listening port 3008");
});
