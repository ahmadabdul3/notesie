import http from 'src/frontend/services/http';
import {
  getAccessToken,
  clearAccessToken
} from 'src/frontend/services/authentication';

const BASE_URL = '/';
const ERROR_TOKEN_EXPIRED = 'TokenExpiredError';

function getHeaders() {
  const accessToken = getAccessToken();
  return { 'AUTHORIZATION': `Bearer ${accessToken}` };
}

function getUrl({ url }) {
  // - url here is the resource name, base url is the server url address
  // - so we're putting together:
  //   base url: http://some-domain.com/ notice the trailing slash
  //   resource name: /users/other-stuff
  // - in this case, we want to remove the leading slash from the resource
  //   name to keep the url clean
  let cleanUrl = url;
  while (cleanUrl.charAt(0) === '/') cleanUrl = cleanUrl.substr(1);
  return BASE_URL + cleanUrl;
}

function handleError(e) {
  if (e && e.error && e.error.name === ERROR_TOKEN_EXPIRED) {
    clearAccessToken();
    window.location.href = '/';
  }
  throw(e);
}

export function dataApiClientGet({ url }) {
  return http.get(getUrl({ url }), getHeaders()).catch(handleError);
}

export function dataApiClientPost({ url, data }) {
  return http.post(getUrl({ url }), data, getHeaders()).catch(handleError);
}

export function dataApiClientPut({ url, data }) {
  return http.put(getUrl({ url }), data, getHeaders()).catch(handleError);
}

export function dataApiClientPatch({ url, data }) {
  return http.patch(getUrl({ url }), data, getHeaders()).catch(handleError);
}

export function dataApiClientDelete({ url, data }) {
  return http.delete(getUrl({ url }), data, getHeaders()).catch(handleError);
}
