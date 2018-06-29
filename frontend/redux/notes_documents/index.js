
const actions = {};

actions.addNotesDocument = function(data) {
  return {
    type: 'ADD_NOTES_DOCUMENT',
    data
  };
};

actions.deleteNotesDocument = function(data) {
  return {
    type: 'DELETE_NOTES_DOCUMENT',
    data,
  };
}

export { actions };

const initialState = {
  items: [],
};

export default function notesDocuments(state = initialState, action) {
  switch (action.type) {
    case 'ADD_NOTES_DOCUMENT':
      return {
        ...state,
        items: [...state.items, action.data],
      };

    case 'DELETE_NOTES_DOCUMENT':
      // - this does a mutation, will change it to
      //   something like slice instead
      state.items.splice(action.data.index, 1);
      return {
        ...state,
        items: [...state.items],
      };

    default: return state;
  }
}
