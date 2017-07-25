const express = require("express");
const config = require("../config");

const router = express.Router();

if (config.env === "development") {
  const MAX_LATENCY = 1200;
  router.use((req, res, next) => {
    const latency = Math.random() * MAX_LATENCY;
    setTimeout(next, latency);
  });
}

const login = (req, res, next) => {
  console.log("coucou");
  res.json({
    name: "Hugo",
    id: 0,
    token: "1234567890",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/718smiley.svg/100px-718smiley.svg.png"
  });
};

router.route("/login").post(login);

module.exports = router;
