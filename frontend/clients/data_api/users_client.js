import {
  dataApiClientGet,
  dataApiClientPost,
  // dataApiClientPut,
  // dataApiClientPatch,
  // dataApiClientDelete
} from './data_api_client';

//
// USER CLIENT - communicates with user routes
//
const RESOURCE_NAME = 'user';
const RESOURCE_NAME_URL = 'users';
function getResourceUrl() { return RESOURCE_NAME_URL + '/'; }

export function getUser() {
  return dataApiClientGet({ url: getResourceUrl() });
}

export function createUser({ data }) {
  return dataApiClientPost({
    url: getResourceUrl(),
    data: { [RESOURCE_NAME]: data },
  });
}

// export function updateUser({ data }) {
//   return dataApiClientPatch({
//     url: getResourceUrl(),
//     data: { [RESOURCE_NAME]: data },
//   });
// }
