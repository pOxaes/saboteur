const jwt = require("jsonwebtoken");
const promisify = require("../../../utils/promisify");
const db = require("./db");
const uuid = require("node-uuid");

const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ALGORITHM = process.env.JWT_ALGORITHM;

const DB_PRIMARY_KEY = "id";
const DB_TABLE = "users";

async function createUser(profile) {
  const user = {
    id: uuid.v4(),
    name: profile.name,
    email: profile.email,
    avatarUrl: profile.avatarUrl
  };

  db.insert(DB_TABLE, DB_PRIMARY_KEY, user);
  return user;
}

async function getAllAsDictionnary() {
  const users = await db.getAll(DB_TABLE);
  return users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});
}

async function createToken({ email, name, id }) {
  return jwtSign({ email, name, id }, JWT_SECRET, {
    algorithm: JWT_ALGORITHM
  });
}

async function getTokenPayload(token) {
  return jwtVerify(token, JWT_SECRET, {
    algorithms: [JWT_ALGORITHM]
  });
}

async function getByEmail(email) {
  const user = await db.find(DB_TABLE, user => user.email === email);
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
  const token = await createToken(user);
  return {
    user,
    token
  };
}

module.exports = {
  createUser,
  login,
  getAllAsDictionnary,
  createToken,
  getTokenPayload
};
