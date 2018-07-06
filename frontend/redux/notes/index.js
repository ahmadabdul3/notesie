
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

actions.startEditNotesItem = function(data) {
  return {
    type: 'START_EDIT_NOTES_ITEM',
    data,
  };
}

actions.cancelEditNotesItem = function(data) {
  // - data here is probably empty
  return {
    type: 'CANCEL_EDIT_NOTES_ITEM',
    data,
  };
}

actions.finishEditNotesItem = function(data) {
  return {
    type: 'FINISH_EDIT_NOTES_ITEM',
    data,
  };
}

export { actions };

const initialState = {
  // - this documents object's keys are the document ids where the
  //   notes belong
  documents: {},
  notesItemBeingEdited: false,
  notesItemBeingEditedText: '',
  notesItemBeingEditedId: null,
  notesItemBeingEditedDocumentId: null,
};

export default function notes(state = initialState, action) {
  let documentId;
  let notesItemIndex;
  let newNotes;

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
      documentId = action.data.documentId;
      notesItemIndex = action.data.index;
      newNotes = [];
      state.documents[documentId].forEach((item, index) => {
        if (notesItemIndex !== index) newNotes.push(item);
      });


      return {
        ...state,
        documents: {
          ...state.documents,
          [documentId]: newNotes,
        }
      };

    case 'START_EDIT_NOTES_ITEM':
      documentId = action.data.documentId;
      notesItemIndex = action.data.index;

      return {
        ...state,
        notesItemBeingEdited: true,
        notesItemBeingEditedId: notesItemIndex,
        notesItemBeingEditedDocumentId: documentId,
      };

    case 'CANCEL_EDIT_NOTES_ITEM':
      return {
        ...state,
        notesItemBeingEdited: false,
        notesItemBeingEditedId: null,
        notesItemBeingEditedDocumentId: null,
      };

    case 'FINISH_EDIT_NOTES_ITEM':
      documentId = action.data.documentId;
      notesItemIndex = action.data.index;

      const newNotesItem = {
        ...state.documents[documentId][notesItemIndex],
        notesText: action.data.notesText,
        notesType: action.data.notesType,
      };

      newNotes = [];
      state.documents[documentId].forEach((item, index) => {
        if (notesItemIndex === index) newNotes.push(newNotesItem);
        else newNotes.push(item);
      });

      return {
        ...state,
        documents: {
          ...state.documents,
          [documentId]: newNotes,
        },
        notesItemBeingEdited: false,
        notesItemBeingEditedId: null,
        notesItemBeingEditedDocumentId: null,
      };


    default: return state;
  }
}
