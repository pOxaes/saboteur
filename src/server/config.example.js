import staticConfig from "./config.static";

const config = {
  db: {
    user: "",
    password: "",
    host: "",
    database: ""
  }
};

module.exports = Object.assign(staticConfig, config);
