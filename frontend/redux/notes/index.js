
const actions = {};

actions.addNotesItem = function(data) {
  return {
    type: 'ADD_NOTES_ITEM',
    data
  };
};

actions.deleteNotesItem = function(data) {
  return {
    type: 'DELETE_NOTES_ITEM',
    data,
  };
}

export { actions };

const initialState = {
  documents: {},
};

export default function notes(state = initialState, action) {
  let documentId;
  switch (action.type) {
    case 'ADD_NOTES_ITEM':
      const documents = { ...state.documents };
      documentId = action.data.documentId;
      if (documents[documentId]) {
        documents[documentId] = [...documents[documentId], action.data];
      } else {
        documents[documentId] = [action.data];
      }
      return {
        ...state,
        documents,
      };

    case 'DELETE_NOTES_ITEM':
      // - this does a mutation, will change it to
      //   something like slice instead
      documentId = action.data.documentId;
      const newNotes = [];
      state.documents[documentId].forEach((item, index) => {
        if (action.data.index !== index) newNotes.push(item);
      });


      return {
        ...state,
        documents: {
          ...state.documents,
          [documentId]: newNotes,
        }
      };

    default: return state;
  }
}
