
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
      newNotes = state.documents[documentId].filter((item, index) => {
        if (notesItemIndex !== index) return item;
      });

      let editState = {};
      // - currently, we don't allow deletion of notes items during edit mode
      //   except if it's the editing notes item - so we can assume this case
      //   will only run for the notes being edited, so we don't need to
      //   check for matching index/id - just check if we're in edit mode
      if (state.notesItemBeingEdited) {
        editState = getCancelEditNotesItemState();
      }

      return {
        ...state,
        documents: {
          ...state.documents,
          [documentId]: newNotes,
        },
        ...editState,
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
        ...getCancelEditNotesItemState(),
      };

    case 'FINISH_EDIT_NOTES_ITEM':
      documentId = action.data.documentId;
      notesItemIndex = action.data.index;

      const newNotesItem = {
        ...state.documents[documentId][notesItemIndex],
        notesText: action.data.notesText,
        notesType: action.data.notesType,
      };

      newNotes = state.documents[documentId].map((item, index) => {
        if (notesItemIndex === index) return newNotesItem;
        return item;
      });

      return {
        ...state,
        documents: {
          ...state.documents,
          [documentId]: newNotes,
        },
        ...getCancelEditNotesItemState(),
      };


    default: return state;
  }
}

function getCancelEditNotesItemState() {
  return {
    notesItemBeingEdited: false,
    notesItemBeingEditedId: null,
    notesItemBeingEditedDocumentId: null,
  };
}
