
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

actions.setMetaKeyUp = function() {
  return {
    type: 'SET_META_KEY_UP',
  };
};

actions.setMetaKeyDown = function() {
  return {
    type: 'SET_META_KEY_DOWN',
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
  metaKeyPressed: false,
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
    case 'SET_META_KEY_UP':
      return {
        ...state,
        metaKeyPressed: false,
      };

    case 'SET_META_KEY_DOWN':
      return {
        ...state,
        metaKeyPressed: true,
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
      return handleToggleNotesItem({ action, state });

    default: return state;
  }
}

function handleToggleNotesItem({ action, state }) {
  const documentId = action.data.documentId;
  const actionNotesItem = action.data.notesItem;
  const nowClickedNotesItem = state.documents[documentId][actionNotesItem.index];
  let multSelHighEnd = null;
  let multSelLowEnd = null;

  if (state.shiftKeyPressed) {
    const highLowEnds = getHighLowEnds(
      state.lastClickedNotesItem.index, nowClickedNotesItem.index
    );
    multSelHighEnd = highLowEnds.high;
    multSelLowEnd = highLowEnds.low;
  }

  const currentNotes = state.documents[documentId];
  const {
    newNotes,
    nowClickedNotesItemUpdated,
    selectedNotesItems
  } = getToggledNewNotes({
    notesItem: nowClickedNotesItem,
    lastClickedNotesItem: state.lastClickedNotesItem,
    notes: currentNotes,
    metaKeyPressed: state.metaKeyPressed,
    multSelHighEnd,
    multSelLowEnd,
  });

  return {
    ...state,
    selectedNotesItems,
    documents: {
      ...state.documents,
      [documentId]: newNotes,
    },
    lastClickedNotesItem: { ...nowClickedNotesItemUpdated },
  };
}

function getHighLowEnds(number1, number2) {
  let ends = { high: number1, low: number2 };
  if (number1 < number2) ends = { high: number2, low: number1 };
  return ends;
}

// - the reason we're saving the 'lastClickedNotesItem' in the updated state is
//   because we're not doing an 'unselect' anymore, consider the following:
// - I previously did a multiselect and have 10 notes selected
// - I click on one of the selected notes items, which unselects everything -
//   except the item i just clicked on
// - I should be able to shift-click anywhere and do a multislect. For this to work
//   I can't check against the old state of the item I just clicked on, because
//   it was already selected from before - therefore, when I click on a new
//   unselected notes item, the 2 old states don't match, the first one was
//   selected to begin with while the second one was unselected
// - the issue is, I can't make assumptions about the original state of the
//   last clicked item, because I don't save that state, so I have to work off
//   of the 'updated' state of the last clicked item - make sense?
function getToggledNewNotes({
  notesItem,
  lastClickedNotesItem,
  notes,
  multSelHighEnd,
  multSelLowEnd,
  metaKeyPressed
}) {
  if (!multSelHighEnd && !metaKeyPressed) return singleItemToggle(notesItem, notes);
  if (!multSelHighEnd) return metaKeySelection(notesItem, notes);

  // - We're saving the last clicked notes item's UPDATED state (it means
  //   if we clicked on the last one and it was unselected, and it became selected
  //   we save the selected state as the 'last clicked item')
  // - THEREFORE - we have to check the currently clicked item's selected state, if it's
  //   the same as the last items UPDATED state - it means they didn't start
  //   in the same selection state - so we can't multi select - it doesnt make sense
  // - shift + click has to happen on the same selected state, meaning they
  //   both should have been in the unselected state before they got clicked on
  if (notesItem.selected === lastClickedNotesItem.selected) return singleItemToggle(notesItem, notes);

  // - finally - this is where the multiselect happens
  // - the notes item in the param here is the original without toggling yet,
  //   so we still want to update it's selected state, but we also want to
  //   update the selected state of everything else between the high/low index
  //   notes items to the same selected state that we're changing the clicked
  //   one to, so they all match
  return multiSelect(notesItem, notes, multSelLowEnd, multSelHighEnd);
}

// - these can become services soon
function singleItemToggle(notesItem, notes) {
  let nowClickedNotesItemUpdated = null;
  const selectedNotesItems = [];

  const newNotes = notes.map((note, index) => {
    if (index === notesItem.index) {
      nowClickedNotesItemUpdated = { ...notesItem, selected: true };
      selectedNotesItems.push(notesItem.index);
      return nowClickedNotesItemUpdated;
    }
    return { ...note, selected: false};
  });

  return { newNotes, nowClickedNotesItemUpdated, selectedNotesItems };
}

function metaKeySelection(notesItem, notes) {
  let nowClickedNotesItemUpdated = null;
  const selectedNotesItems = [];

  // - destructuring an array is much faster (when the number of items increases
  //   past thousands)
  // - Since here we're just adding a new 'select: true' item, we can just
  //   destructure the array and mutate that index - but then we have to make
  //   the selected notes items get passed in from above so we can just add a
  //   new index to it
  // - this way is simpler for now
  const newNotes = notes.map((note, index) => {
    if (index === notesItem.index) {
      nowClickedNotesItemUpdated = { ...notesItem, selected: true };
      selectedNotesItems.push[notesItem.index];
      return nowClickedNotesItemUpdated;
    }

    if (note.selected) selectedNotesItems.push(note.index);
    return note;
  });

  return { newNotes, nowClickedNotesItemUpdated, selectedNotesItems };
}

function multiSelect(notesItem, notes, lowEnd, highEnd) {
  const desiredSelectedState = !notesItem.selected;
  const selectedNotesItems = [];
  let nowClickedNotesItemUpdated = null;

  const newNotes = notes.map((note, index) => {
    if (index >= lowEnd && index <= highEnd && !note.deleted) {
      const updatedNote = { ...note, selected: desiredSelectedState};
      if (index === notesItem.index) nowClickedNotesItemUpdated = updatedNote;
      selectedNotesItems.push(note.index);
      return updatedNote;
    }

    return note;
  });

  return { newNotes, nowClickedNotesItemUpdated, selectedNotesItems };
}

function getCancelEditNotesItemState() {
  return {
    notesItemBeingEdited: false,
    notesItemBeingEditedId: null,
    notesItemBeingEditedDocumentId: null,
  };
}
