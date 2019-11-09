
const actions = {};

actions.openModal = function(data) {
  return {
    type: 'OPEN_MODAL',
    data
  };
};

actions.closeModal = function(data) {
  return {
    type: 'CLOSE_MODAL',
  };
};

export { actions };

const initialState = {
  openModalName: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        openModalName: action.data.modalName,
      };

    case 'CLOSE_MODAL':
      return {
        openModalName: '',
      };

    default: return state;
  }
}
