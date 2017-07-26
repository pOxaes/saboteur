const uuid = require("node-uuid");
const jwt = require("jsonwebtoken");
const promisify = require("../../../utils/promisify");
const db = require("./db");

const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ALGORITHM = process.env.JWT_ALGORITHM;

const DB_PRIMARY_KEY = "email";
const DB_TABLE = "users";

async function createUser(profile) {
  const user = {
    name: profile.name,
    email: profile.email,
    avatarUrl: profile.avatarUrl
  };

  db.insert(DB_TABLE, DB_PRIMARY_KEY, user);
  return user;
}

async function createToken(user, roles) {
  return jwtSign({ email: user.email, roles }, JWT_SECRET, {
    algorithm: JWT_ALGORITHM
  });
}

async function getTokenPayload(token) {
  return jwtVerify(token, JWT_SECRET, {
    algorithms: [JWT_ALGORITHM]
  });
}

async function getByEmail(email) {
  const user = await db.get(DB_TABLE, email);
  return user;
}

async function login(profile) {
  if (!profile.email) {
    throw new Error("An email is needed");
  }
  let user = await getByEmail(profile.email);

  if (!user) {
    user = await createUser(profile);
  }

  const token = await createToken(user, ["login"]);

  return {
    user,
    token
  };
}

module.exports = {
  createUser,
  login,

  createToken,
  getTokenPayload
};
