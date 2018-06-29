
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
  items: [],
};

export default function notes(state = initialState, action) {
  switch (action.type) {
    case 'ADD_NOTES_ITEM':
      return {
        ...state,
        items: [...state.items, action.data],
      };

    case 'DELETE_NOTES_ITEM':
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
