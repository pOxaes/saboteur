const storage = require("node-persist");

storage.init({
  dir: process.env.NODE_PERSIST_DIR
});

const toItemName = (table, id) => `${table}_${id.trim().toLowerCase()}`;

async function insert(table, primaryKey, data) {
  return storage.setItem(toItemName(table, data[primaryKey]), data);
}

async function remove(table, id) {
  return storage.removeItem(toItemName(table, id));
}

async function get(table, id) {
  return storage.getItem(toItemName(table, id));
}

async function getAll(table) {
  return storage.valuesWithKeyMatch(`${table}_`);
}

async function find(table, findFoo) {
  const items = await getAll(table);
  return items.find(findFoo);
}

module.exports = {
  find,
  get,
  getAll,
  insert,
  remove
};
