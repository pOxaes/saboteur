const STORAGE_NAMESPACE = "user";

const get = () => {
  return JSON.parse(localStorage.getItem(STORAGE_NAMESPACE));
};

const set = user => {
  localStorage.setItem(STORAGE_NAMESPACE, JSON.stringify(user));
  return user;
};

export default {
  get,
  set
};
