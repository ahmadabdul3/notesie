import {
  dataApiClientGet,
  dataApiClientPost,
  // dataApiClientPut,
  dataApiClientPatch,
  // dataApiClientDelete
} from './data_api_client';

//
// NOTEITEM CLIENT - communicates with note-item routes
//
const RESOURCE_NAME = 'noteItem';
const RESOURCE_NAME_URL = 'note-items';
function getResourceUrl() { return RESOURCE_NAME_URL + '/'; }

export function getNoteItemsForNotebbook({ data }) {
  const { notebookId } = data;
  const url = getResourceUrl() + 'for-notebook/' + notebookId;
  return dataApiClientGet({ url });
}

export function createNoteItem({ data }) {
  return dataApiClientPost({
    url: getResourceUrl(),
    data: { [RESOURCE_NAME]: data },
  });
}

export function updateNoteItem({ data }) {
  const url = getResourceUrl() + data.id;

  return dataApiClientPatch({
    url,
    data: { [RESOURCE_NAME]: data },
  });
}

export function insertNoteItemBefore({ data, orderOfOriginalNoteItem }) {
  const url = getResourceUrl() + 'insert-before';

  return dataApiClientPost({
    url,
    data: { [RESOURCE_NAME]: data, orderOfOriginalNoteItem },
  });
}

export function insertNoteItemAfter({ data, orderOfOriginalNoteItem }) {
  const url = getResourceUrl() + 'insert-after';

  return dataApiClientPost({
    url,
    data: { [RESOURCE_NAME]: data, orderOfOriginalNoteItem },
  });
}
