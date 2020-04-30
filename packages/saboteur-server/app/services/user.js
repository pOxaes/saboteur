const jwt = require("jsonwebtoken");
const { promisify } = require("saboteur-shared/src/utils");
const db = require("./db");
const uuid = require("node-uuid");

const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ALGORITHM = process.env.JWT_ALGORITHM;

const DB_PRIMARY_KEY = "id";
const DB_TABLE = "users";

//https://stackoverflow.com/questions/16941104/remove-a-parameter-to-the-url-with-javascript
function withoutParam(sourceURL, key) {
  var rtn = sourceURL.split("?")[0],
    param,
    params_arr = [],
    queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";
  if (queryString !== "") {
    params_arr = queryString.split("&");
    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split("=")[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    rtn = rtn + (params_arr.length ? "?" + params_arr.join("&") : "");
  }
  return rtn;
}

async function createUser(profile) {
  const user = {
    id: uuid.v4(),
    name: profile.name,
    email: profile.email,
    avatarUrl: profile.avatarUrl,
  };

  await db.insert(DB_TABLE, DB_PRIMARY_KEY, user);
  return user;
}

async function getAllAsDictionnary() {
  const users = await db.getAll(DB_TABLE);
  return users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});
}

async function createToken({ email, name, id, avatarUrl }) {
  return jwtSign({ email, name, id, avatarUrl }, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
  });
}

async function getTokenPayload(token) {
  return jwtVerify(token, JWT_SECRET, {
    algorithms: [JWT_ALGORITHM],
  });
}

async function getByEmail(email) {
  return db.find(DB_TABLE, (user) => user.email === email);
}

async function getById(id) {
  return db.find(DB_TABLE, (user) => user.id === id);
}

async function login(profile) {
  if (!profile.email) {
    throw new Error("An email is needed");
  }
  let user = await getByEmail(profile.email);
  if (!user) {
    user = await createUser(profile);
  }
  const token = await createToken(user);
  return {
    user,
    token,
  };
}

module.exports = {
  createUser,
  login,
  getById,
  getAllAsDictionnary,
  createToken,
  getTokenPayload,
};
