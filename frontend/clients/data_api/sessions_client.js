import {
  // dataApiClientGet,
  dataApiClientPost,
  // dataApiClientPut,
  // dataApiClientPatch,
  // dataApiClientDelete
} from './data_api_client';

//
// SESSION CLIENT - communicates with session routes
//
const RESOURCE_NAME = 'session';
const RESOURCE_NAME_URL = 'sessions';
function getResourceUrl() { return RESOURCE_NAME_URL + '/'; }

export function createSession({ data }) {
  return dataApiClientPost({
    url: getResourceUrl(),
    data: { [RESOURCE_NAME]: data },
  });
}
