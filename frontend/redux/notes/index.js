
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
};

actions.startEditNotesItem = function(data) {
  return {
    type: 'START_EDIT_NOTES_ITEM',
    data,
  };
};

actions.cancelEditNotesItem = function(data) {
  // - data here is probably empty
  return {
    type: 'CANCEL_EDIT_NOTES_ITEM',
    data,
  };
};

actions.finishEditNotesItem = function(data) {
  return {
    type: 'FINISH_EDIT_NOTES_ITEM',
    data,
  };
};

actions.toggleNotesItem = function(data) {
  return {
    type: 'TOGGLE_NOTES_ITEM',
    data,
  };
};

actions.setShiftKeyUp = function() {
  return {
    type: 'SET_SHIFT_KEY_UP',
  };
};

actions.setShiftKeyDown = function() {
  return {
    type: 'SET_SHIFT_KEY_DOWN',
  };
};

actions.setControlKeyUp = function() {
  return {
    type: 'SET_CTRL_KEY_UP',
  };
};

actions.setControlKeyDown = function() {
  return {
    type: 'SET_CTRL_KEY_DOWN',
  };
};

export { actions };

const initialState = {
  // - this documents object's keys are the document ids where the
  //   notes belong
  documents: {},
  notesItemBeingEdited: false,
  notesItemBeingEditedText: '',
  notesItemBeingEditedId: null,
  notesItemBeingEditedDocumentId: null,
  selectedNotesItems: [],
  notesItemInitialSelection: false,
  shiftKeyPressed: false,
  ctrlKeyPressed: false,
  lastClickedNotesItem: null,
};

export default function notes(state = initialState, action) {
  let documentId;
  let notesItemIndex;
  let newNotes;
  let newNotesItem;
  let currentNotes;
  let nowClickedNotesItem;

  switch (action.type) {
    case 'SET_CTRL_KEY_UP':
      return {
        ...state,
        controlKeyPressed: false,
      };

    case 'SET_CTRL_KEY_DOWN':
      return {
        ...state,
        controlKeyPressed: true,
      };

    case 'SET_SHIFT_KEY_UP':
      return {
        ...state,
        shiftKeyPressed: false,
      };

    case 'SET_SHIFT_KEY_DOWN':
      return {
        ...state,
        shiftKeyPressed: true,
      };

    case 'ADD_NOTES_ITEM':
      const documents = { ...state.documents };
      documentId = action.data.documentId;
      currentNotes = documents[documentId];
      newNotes = { ...action.data };

      if (currentNotes) {
        newNotes.index = currentNotes.length;
        documents[documentId] = [...currentNotes, newNotes];
      } else {
        newNotes.index = 0;
        documents[documentId] = [newNotes];
      }

      return {
        ...state,
        documents,
      };

    case 'DELETE_NOTES_ITEM':
      documentId = action.data.documentId;
      notesItemIndex = action.data.index;

      // newNotes = [];
      // let newIndex = -1;
      newNotes = state.documents[documentId].map((item, index) => {
        if (notesItemIndex !== index) return item;
        return { ...item, deleted: true };
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

      newNotesItem = {
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

    case 'TOGGLE_NOTES_ITEM':
      documentId = action.data.documentId;
      const actionNotesItem = action.data.notesItem;
      // - dont need this anymore since each notes item has it's index
      //   as part of its attributes
      notesItemIndex = action.data.index;
      nowClickedNotesItem = state.documents[documentId][actionNotesItem.index];
      let multSelHighEnd = null;
      let multSelLowEnd = null;

      if (state.shiftKeyPressed) {
        const highLowEnds = getHighLowEnds(
          state.lastClickedNotesItem.index, nowClickedNotesItem.index
        );
        multSelHighEnd = highLowEnds.high;
        multSelLowEnd = highLowEnds.low;
      }

      currentNotes = state.documents[documentId];
      newNotes = getToggledNewNotes(
        nowClickedNotesItem, state.lastClickedNotesItem, currentNotes, multSelHighEnd, multSelLowEnd, state.controlKeyPressed
      );

      // - this logic has to change too, do we use it for anything?
      // - might be useful for doing an 'unselect all' button or doing bulk updates
      //   so we have a list of all the indexes so we don't loop through every
      //   notes item - just the ones in this list
      // - basically - the logic has to change to something that will add
      //   all the indexes of a multi-select selection. Right now it assumes
      //   only 1 selection is happening at a time
      const newSelectedNotesItems = state.selectedNotesItems.filter((item) => {
        return item !== notesItemIndex;
      });

      if (!actionNotesItem.selected) newSelectedNotesItems.push(notesItemIndex);

      return {
        ...state,
        documents: {
          ...state.documents,
          [documentId]: newNotes,
        },
        selectedNotesItems: newSelectedNotesItems,
        lastClickedNotesItem: { ...nowClickedNotesItem },
      };


    default: return state;
  }
}

// - this just returns an object with keys for each index in the range of
//   the multiselect boundaries
// - so if a user clicks item 1 then shift clicks item 4, we get the following:
//   { '1': 1, '2': 2, '3': 3, '4': 4 }
// *** MAY NOT NEED THIS *** COULD JUST CHECK IF INDEX IS > OR < HIGH/LOW ENDS
// function createMultiSelectIndexes(lastClickedNotesItem, nowClickedNotesItem) {
//   const { highEnd, lowEnd } = getHighLowEnds(lastClickedNotesItem, nowClickedNotesItem);
//   const multiSelectIndexes = {};
//
//   for (let i = lowEnd; i <= highEnd; i++) {
//     multiSelectIndexes[i] = i;
//   }
//
//   return multiSelectIndexes;
// }

function getHighLowEnds(number1, number2) {
  let ends = { high: number1, low: number2 };
  if (number1 < number2) ends = { high: number2, low: number1 };
  return ends;
}

function getToggledNewNotes(
  notesItem, lastClickedNotesItem, notes, multSelHighEnd, multSelLowEnd, controlKeyPressed,
) {
  if (!multSelHighEnd && !controlKeyPressed) return singleItemToggle(notesItem, notes);
  // - we check if the currently clicked notes item and the last clicked
  //   notes item had different selected state - if so, we can't multi-select
  // - shift + click has to happen on the same selected state

  if (!multSelHighEnd && controlKeyPressed) return controlKeySelection(notesItem, notes);

  if (notesItem.selected !== lastClickedNotesItem.selected) return singleItemToggle(notesItem, notes);
  // - finally - this is where the multiselect happens
  // - the notes item in the param here is the original without toggling yet,
  //   so we still want to update it's selected state, but we also want to
  //   update the selected state of everything else between the high/low index
  //   notes items to the same selected state that we're changing the clicked
  //   one to, so they all match
  const desiredSelectedState = !notesItem.selected;
  return notes.map((note, index) => {
    if (index >= multSelLowEnd && index <= multSelHighEnd && !note.deleted) {
      return { ...note, selected: desiredSelectedState};
    }

    return note;
  });
}

function singleItemToggle(notesItem, notes) {
  return notes.map((note, index) => {
    if (index === notesItem.index) return { ...notesItem, selected: true };
    return { ...note, selected: false};
  });
}

function controlKeySelection(notesItem, notes) {
  return notes.map((note, index) => {
    if (index === notesItem.index) return { ...notesItem, selected: true };
    return note;
  });
}

function getCancelEditNotesItemState() {
  return {
    notesItemBeingEdited: false,
    notesItemBeingEditedId: null,
    notesItemBeingEditedDocumentId: null,
  };
}
