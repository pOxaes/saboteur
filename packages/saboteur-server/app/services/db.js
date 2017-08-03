const storage = require("node-persist");

storage.init({
  dir: process.env.NODE_PERSIST_DIR
});

const toItemName = (table, id) => `${table}_${id.trim().toLowerCase()}`;

async function insert(table, primaryKey, data) {
  const item = await storage.setItem(toItemName(table, data[primaryKey]), data);
  return item;
}

async function remove(table, id) {
  const item = await storage.removeItem(toItemName(table, id));
  return item;
}

async function get(table, id) {
  const item = await storage.getItem(toItemName(table, id));
  return item;
}

async function getAll(table) {
  const items = await storage.valuesWithKeyMatch(`${table}_`);
  return items;
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
