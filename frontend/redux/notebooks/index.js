
const actions = {};

export function loadNotebooks(data) {
  return {
    type: 'LOAD_NOTEBOOKS',
    data,
  };
}

export function addNotebook(data) {
  return {
    type: 'ADD_NOTEBOOK',
    data,
  };
}

export function deleteNotebook(data) {
  return {
    type: 'DELETE_NOTEBOOK',
    data,
  };
}

const initialState = {
  id: 1,
  items: {},
};

export default function notebooks(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_NOTEBOOKS':
      const notebooks = action.data.reduce((acc, notebook) => {
        acc[notebook.id] = notebook;
        return acc;
      }, {});

      return {
        ...state,
        items: notebooks,
      };
    case 'ADD_NOTEBOOK':
      const newDocument = action.data;
      newDocument.id = state.id;
      const id = state.id + 1;

      return {
        ...state,
        id,
        items: {
          ...state.items,
          [newDocument.id]: newDocument,
        },
      };

    case 'DELETE_NOTEBOOK':
      // THIS DOESNT ACTUALLY WORK YET
      // - this does a mutation, will change it to
      //   something like slice instead
      // state.items.splice(action.data.index, 1);
      // return {
      //   ...state,
      //   items: [...state.items],
      // };

    default: return state;
  }
}
