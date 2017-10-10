import actions from "../store/actions";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const TOKEN_STORAGE_KEY = "token";

function login(googleAuthorizationCode) {
  return actions.login(googleAuthorizationCode).then(({ token }) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
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

export default {
  GOOGLE_CLIENT_ID,
  login,
  logout,
  isAuthenticated,
  getToken,

  addChangeListener,
  removeChangeListener
};
