const storage = require("node-persist");

storage.init();

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

module.exports = {
  get,
  getAll,
  insert,
  remove
};
