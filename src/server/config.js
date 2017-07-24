const yargs = require("yargs");
const path = require("path");

const DEFAULT_ENV = "production";
const args = yargs.argv;
const env = args.env || process.env.NODE_ENV || DEFAULT_ENV;

const config = {
  dir: __dirname,
  dist: path.join(__dirname, "dist"),
  server: {
    routeBase: "",
    port: 3011
  },

  db: {
    user: "",
    password: "",
    host: "",
    database: ""
  },

  env
};

module.exports = config;
