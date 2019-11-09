
const KEY__ACCESS_TOKEN = 'key__notesie__access_token';

export function getAccessToken() {
  return localStorage.getItem(KEY__ACCESS_TOKEN);
}

export function userIsAuthenticated() {
  return getAccessToken();
}

export function saveAccessToken({ accessToken }) {
  localStorage.setItem(KEY__ACCESS_TOKEN, accessToken);
}

export function clearAccessToken() {
  localStorage.removeItem(KEY__ACCESS_TOKEN);
}
