import {
  dataApiClientGet,
  dataApiClientPost,
  // dataApiClientPut,
  // dataApiClientPatch,
  // dataApiClientDelete
} from './data_api_client';

//
// NOTEBOOK CLIENT - communicates with notebook routes
//
const RESOURCE_NAME = 'notebook';
const RESOURCE_NAME_URL = 'notebooks';
function getResourceUrl() { return RESOURCE_NAME_URL + '/'; }

export function getNotebooks() {
  return dataApiClientGet({ url: getResourceUrl() });
}

export function createNotebook({ data }) {
  return dataApiClientPost({
    url: getResourceUrl(),
    data: { [RESOURCE_NAME]: data },
  });
}
