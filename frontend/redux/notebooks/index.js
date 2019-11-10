
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
  itemsAsObject: {},
  items: [],
};

export default function notebooks(state = initialState, action) {
  let notebooks;

  switch (action.type) {
    case 'LOAD_NOTEBOOKS':
      notebooks = action.data.reduce((acc, notebook) => {
        acc[notebook.id] = notebook;
        return acc;
      }, {});

      return {
        ...state,
        itemsAsObject: notebooks,
        items: action.data,
      };
    case 'ADD_NOTEBOOK':
      const newNotebook = action.data;
      notebooks = [ ...state.items, newNotebook ];

      return {
        ...state,
        itemsAsObject: {
          ...state.items,
          [newNotebook.id]: newNotebook,
        },
        items: notebooks,
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
