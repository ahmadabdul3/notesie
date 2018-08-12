
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
  beforeEditSelectedNotesItems: [],
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
      return handleDeleteNotesItem({ state, action });

    case 'START_EDIT_NOTES_ITEM':
      return handleStartEditNotesItem({ state, action });

    case 'CANCEL_EDIT_NOTES_ITEM':
      return handleCancelEditNotesItem({ state, action });

    case 'FINISH_EDIT_NOTES_ITEM':
      return handleFinishEditNotesItem({ state, action });

    case 'TOGGLE_NOTES_ITEM':
      return handleToggleNotesItem({ action, state });

    default: return state;
  }
}

function handleDeleteNotesItem({ state, action }) {
  const documentId = action.data.documentId;
  const notesItemIndex = action.data.index;
  let noteBlockWasSelected = false;
  const newNotes = state.documents[documentId].map((item, index) => {
    if (notesItemIndex !== index) return item;
    if (item.selected) noteBlockWasSelected = true;
    return { ...item, deleted: true, selected: false };
  });

  let editState = {};
  // - currently, we don't allow deletion of notes items during edit mode
  //   except if it's the editing notes item - so we can assume this case
  //   will only run for the notes being edited, so we don't need to
  //   check for matching index/id - just check if we're in edit mode
  if (state.notesItemBeingEdited) {
    editState = getCancelEditNotesItemState();
  }

  state.beforeEditSelectedNotesItems.forEach((noteIndex) => {
    newNotes[noteIndex].selected = true;
  });

  const newState = {
    ...state,
    documents: {
      ...state.documents,
      [documentId]: newNotes,
    },
    ...editState,
  };

  // - it might be worth making selectedNotesItems an object, this way
  //   we don't have to filter here, just make a new object without that
  //   key... or maybe that doesn't make sense because other places
  //   will be more complex - will have to think about it
  if (noteBlockWasSelected) {
    // - if the deleted note item was selected, we need to update the
    //   selected notes items list, otherwise, we're good
    const newSelectedNotesItems = state.selectedNotesItems.filter((noteIndex) => {
      return noteIndex !== notesItemIndex;
    });
    newState.selectedNotesItems = newSelectedNotesItems;
  }

  return newState;
}

function handleStartEditNotesItem({ state, action }) {
  const documentId = action.data.documentId;
  const notesItemIndex = action.data.index;
  const newNotes = [...state.documents[documentId]];
  state.selectedNotesItems.forEach((noteIndex) => {
    newNotes[noteIndex].selected = false;
  });

  return {
    ...state,
    notesItemBeingEdited: true,
    notesItemBeingEditedId: notesItemIndex,
    notesItemBeingEditedDocumentId: documentId,
    // - temporarily save selected notes items so we can restore
    //   the selected notes after edits are done
    beforeEditSelectedNotesItems: [...state.selectedNotesItems],
    selectedNotesItems: [],
    documents: {
      ...state.documents,
      [documentId]: newNotes,
    },
  };
}

function handleFinishEditNotesItem({ state, action }) {
  const documentId = action.data.documentId;
  const notesItemIndex = action.data.index;

  const newNotesItem = {
    ...state.documents[documentId][notesItemIndex],
    notesText: action.data.notesText,
    notesType: action.data.notesType,
  };

  const newNotes = [...state.documents[documentId]];
  newNotes[notesItemIndex] = newNotesItem;
  state.beforeEditSelectedNotesItems.forEach((noteIndex) => {
    newNotes[noteIndex].selected = true;
  });

  return {
    ...state,
    documents: {
      ...state.documents,
      [documentId]: newNotes,
    },
    ...getCancelEditNotesItemState(),
    selectedNotesItems: [...state.beforeEditSelectedNotesItems],
    beforeEditSelectedNotesItems: [],
  };
}

function handleCancelEditNotesItem({ state, action }) {
  const documentId = state.notesItemBeingEditedDocumentId;
  const notesItemIndex = state.notesItemBeingEditedId;
  const newNotes = [...state.documents[documentId]];
  state.beforeEditSelectedNotesItems.forEach((noteIndex) => {
    newNotes[noteIndex].selected = true;
  });

  return {
    ...state,
    ...getCancelEditNotesItemState(),
    selectedNotesItems: [...state.beforeEditSelectedNotesItems],
    beforeEditSelectedNotesItems: [],
    documents: {
      ...state.documents,
      [documentId]: newNotes,
    },
  };
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
    selectedNotesItems: state.selectedNotesItems,
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
//   because of the following scenario:
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
  metaKeyPressed,
  selectedNotesItems,
}) {
  if (!multSelHighEnd && !metaKeyPressed) {
    return singleItemToggle(notesItem, notes, selectedNotesItems);
  }
  if (!multSelHighEnd) return metaKeySelection(notesItem, notes);

  // - We're saving the last clicked notes item's UPDATED state (it means
  //   if we clicked on the last one and it was unselected, and it became selected
  //   we save the selected state as the 'last clicked item')
  // - THEREFORE - we have to check the currently clicked item's selected state, if it's
  //   the same as the last items UPDATED state - it means they didn't start
  //   in the same selection state - so we can't multi select - it doesnt make sense
  // - shift + click has to happen on the same selected state, meaning they
  //   both should have been in the unselected state before they got clicked on
  if (notesItem.selected === lastClickedNotesItem.selected) {
    return singleItemToggle(notesItem, notes, selectedNotesItems);
  }

  // - finally - this is where the multiselect happens
  // - the notes item in the param here is the original without toggling yet,
  //   so we still want to update it's selected state, but we also want to
  //   update the selected state of everything else between the high/low index
  //   notes items to the same selected state that we're changing the clicked
  //   one to, so they all match
  return multiSelect(notesItem, notes, multSelLowEnd, multSelHighEnd);
}

// - these can become services soon
function singleItemToggle(notesItem, notes, currentSelectedNotesItems) {
  let nowClickedNotesItemUpdated = null;
  const selectedNotesItems = [];

  const newNotes = notes.map((note, index) => {
    if (index === notesItem.index) {
      let newSelectedValue = true;
      // - when there are multiple selected notes items this function doen't
      //   actually do a 'toggle', it just unselects everything except the
      //   notes item we just clicked on, and makes it selected (even if it was
      //   already selected)
      // - BUT - if the currently selected note item is the only selected one
      //   and we click on it,
      //   it will get toggled off - which is what this is checking for
      if (
        currentSelectedNotesItems.length === 1 &&
        currentSelectedNotesItems[0] === index
      ) newSelectedValue = !notesItem.selected;
      nowClickedNotesItemUpdated = { ...notesItem, selected: newSelectedValue };
      if (nowClickedNotesItemUpdated.selected) selectedNotesItems.push(notesItem.index);
      return nowClickedNotesItemUpdated;
    }
    return { ...note, selected: false};
  });

  return { newNotes, nowClickedNotesItemUpdated, selectedNotesItems };
}

// - this is actually a toggle now, notice how we change the selected state
//   for the 'nowClickedNotesItem' to a toggle, not hard coded 'true'
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
      nowClickedNotesItemUpdated = { ...notesItem, selected: !notesItem.selected };
      if (nowClickedNotesItemUpdated.selected) selectedNotesItems.push(notesItem.index);
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
      if (updatedNote.selected) selectedNotesItems.push(note.index);
      return updatedNote;
    }

    // - we need to add to the selectednotesitems here too, the if
    //   condition above applies only to new multiselect blocks, but
    //   we could have a previous multiselect block, and if we're
    //   building the selectedNotesItems array from scratch here, we need
    //   to add other, already selected notes here too
    if (note.selected) selectedNotesItems.push(note.index);
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
