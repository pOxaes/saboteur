import actions from "../store/actions";

const GOOGLE_CLIENT_ID =
  "262090290445-aa1mmt5fpg34dcfkcb1ful7us6fqtjhk.apps.googleusercontent.com";
const TOKEN_STORAGE_KEY = "token";

// TODO: remove once websockets
let inMemoryUser;

function login(googleAuthorizationCode) {
  return actions.login(googleAuthorizationCode).then(({ token, user }) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    inMemoryUser = user;
    notifyListeners(true);
    return token;
  });
}

function logout() {
  const hasChanged = isAuthenticated();
  localStorage.removeItem(TOKEN_STORAGE_KEY);

  if (hasChanged) {
    notifyListeners(false);
  }

  return Promise.resolve();
}

function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function isAuthenticated() {
  return !!getToken();
}

// Listen to storage events
// Listeners won't be notified twice because storage event aren't trigger on the window from which the changes came from
window.addEventListener("storage", ({ key, newValue }) => {
  if (key === TOKEN_STORAGE_KEY) {
    notifyListeners(!!newValue);
  }
});

const listeners = new Set();
function notifyListeners(isAuthenticated) {
  listeners.forEach(fn => fn(isAuthenticated));
}

function addChangeListener(fn) {
  listeners.add(fn);
}

function removeChangeListener(fn) {
  listeners.delete(fn);
}

function getUser() {
  if (!inMemoryUser) {
    inMemoryUser = {};
  }
  return inMemoryUser;
}

export default {
  GOOGLE_CLIENT_ID,
  login,
  logout,
  isAuthenticated,
  getToken,
  getUser,

  addChangeListener,
  removeChangeListener
};
