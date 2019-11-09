import {
  notesItemStatus,
  addStatuses,
  isItemInsertedUnsaved
} from 'src/constants/constants_note_items';

const actions = {};

actions.loadAllNotes = function(data) {
  return {
    type: 'NOTE_ITEM__LOAD_ALL_NOTES',
    data,
  };
};

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

actions.insertNotesBefore = function(data) {
  return {
    type: 'INSERT_NOTES_BEFORE',
    data,
  };
};

actions.insertNotesAfter = function(data) {
  return {
    type: 'INSERT_NOTES_AFTER',
    data,
  };
};

export { actions };

const initialState = {
  // - this notebooks object's keys are the document ids where the
  //   notes belong
  notebooks: {},
  notesItemBeingEdited: false,
  notesItemBeingEditedText: '',
  notesItemBeingEditedId: null,
  notesItemBeingEditedDocumentId: null,
  selectedNotesItems: [],
  notesItemInitialSelection: false,
  shiftKeyPressed: false,
  metaKeyPressed: false,
  lastClickedNotesItem: null,
  noteItemInsertType: null,
  noteItemInsertIndex: null,
};

export default function notes(state = initialState, action) {
  let notebookId;
  let notesItemIndex;
  let newNotes;
  let newNotesItem;
  let currentNotes;
  let nowClickedNotesItem;

  switch (action.type) {
    case 'NOTE_ITEM__LOAD_ALL_NOTES':
      return handleLoadAllNotes({ state, action });
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
      const notebooks = { ...state.notebooks };
      notebookId = action.data.notebookId;
      currentNotes = notebooks[notebookId];
      newNotes = { ...action.data };

      if (currentNotes) {
        newNotes.index = currentNotes.length;
        notebooks[notebookId] = [...currentNotes, newNotes];
      } else {
        newNotes.index = 0;
        notebooks[notebookId] = [newNotes];
      }

      return {
        ...state,
        notebooks,
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

    case 'INSERT_NOTES_BEFORE':
      return handleInsertNotesBefore({ action, state });

    case 'INSERT_NOTES_AFTER':
      return handleInsertNotesAfter({ action, state });

    default: return state;
  }
}

function handleLoadAllNotes({ state, action }) {
  const { notebookId, noteItems } = action.data;
  const newState = { ...state };
  noteItems.forEach((n, i) => n.index = i);

  newState.notebooks[notebookId] = noteItems;
  return newState;
}

function handleDeleteNotesItem({ state, action }) {
  const notebookId = action.data.notebookId;
  const notesItemIndex = action.data.index;
  let noteBlockWasSelected = false;
  const newNotes = state.notebooks[notebookId].map((item, index) => {
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

  const newState = {
    ...state,
    notebooks: {
      ...state.notebooks,
      [notebookId]: newNotes,
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

function getStartEditNotesItemState({ notesItemIndex, notebookId }) {
  return {
    notesItemBeingEdited: true,
    notesItemBeingEditedId: notesItemIndex,
    notesItemBeingEditedDocumentId: notebookId,
  };
}

function handleStartEditNotesItem({ state, action }) {
  const notebookId = action.data.notebookId;
  const notesItemIndex = action.data.index;
  // const newNotes = [...state.notebooks[notebookId]];

  const editState = getStartEditNotesItemState({ notesItemIndex, notebookId });
  return {
    ...state,
    ...editState,
  };
    // - I dont think this is needed, 'newNotes' is not being updated, it's
    //   just taken from notebooks and then put here without being edited
    // notebooks: {
    //   ...state.notebooks,
    //   [notebookId]: newNotes,
    // },
}

function handleFinishEditNotesItem({ state, action }) {
  const notebookId = action.data.notebookId;
  const notesItemIndex = action.data.index;
  const { updatedNoteItem } = action.data;

  const newNotesItem = {
    ...state.notebooks[notebookId][notesItemIndex],
    ...updatedNoteItem,
    status: '',
  };

  const newNotes = [...state.notebooks[notebookId]];
  newNotes[notesItemIndex] = newNotesItem;

  return {
    ...state,
    notebooks: {
      ...state.notebooks,
      [notebookId]: newNotes,
    },
    ...getCancelEditNotesItemState(),
  };
}

function handleCancelEditNotesItem({ state, action }) {
  const { noteItem } = action.data;
  let newState = {
    ...state,
    ...getCancelEditNotesItemState(),
  };
  if (isItemInsertedUnsaved({ item: noteItem })) {
    newState = hardDeleteNotesItem({
      currentState: state,
      newState,
      ...action.data,
    });
  }
  return newState;
}

function hardDeleteNotesItem(options) {
  const { currentState, newState, noteItem, notebookId } = options;
  const notes = currentState.notebooks[notebookId];
  const newNotes = [];
  let noteIndex = 0;
  notes.forEach(note => {
    if (note.index === noteItem.index) return;
    newNotes.push({ ...note, index: noteIndex });
    noteIndex++;
  });

  newState.notebooks[notebookId] = newNotes;
  return newState;
}

function handleInsertNotesBefore({ action, state }) {
  const { noteItem, notebookId, newNote } = action.data;
  const notes = state.notebooks[notebookId];
  const { index } = noteItem;
  const { newNotes, newNotesIndex } = insertNotesBefore({ index, notes, newNote });
  const startEditState = getStartEditNotesItemState({ notesItemIndex: newNotesIndex, notebookId });

  return {
    ...state,
    notebooks: {
      ...state.notebooks,
      [notebookId]: newNotes,
    },
    ...startEditState,
    noteItemInsertType: 'before',
    noteItemInsertIndex: newNotesIndex,
  };
}

function insertNotesBefore({ index, notes, newNote }) {
  const newNotes = [];
  let newNotesIndex = -1;
  let noteIndex = 0;

  notes.forEach((note, i) => {
    if (index === i) {
      newNotes.push({
        ...newNote,
        index: noteIndex,
        status: addStatuses({
          itemStatus: newNote.status,
          newStatuses: [
            notesItemStatus.insertedUnsaved,
            notesItemStatus.insertedBefore
          ]
        }),
      });
      newNotesIndex = noteIndex;
      noteIndex++;
    }
    newNotes.push({ ...note, index: noteIndex });
    noteIndex++;
  });

  return { newNotes, newNotesIndex };
}

function handleInsertNotesAfter({ action, state }) {
  const { noteItem, notebookId, newNote } = action.data;
  const notes = state.notebooks[notebookId];
  const { index } = noteItem;
  const { newNotes, newNotesIndex } = insertNotesAfter({ index, notes, newNote });
  const startEditState = getStartEditNotesItemState({ notesItemIndex: newNotesIndex, notebookId });

  return {
    ...state,
    notebooks: {
      ...state.notebooks,
      [notebookId]: newNotes,
    },
    ...startEditState,
    noteItemInsertType: 'after',
    noteItemInsertIndex: newNotesIndex,
  };
}

function insertNotesAfter({ index, notes, newNote }) {
  const newNotes = [];
  let newNotesIndex = -1;
  let noteIndex = 0;

  notes.forEach((note, i) => {
    newNotes.push({ ...note, index: noteIndex });
    noteIndex++;

    if (index === i) {
      newNotes.push({
        ...newNote,
        index: noteIndex,
        status: addStatuses({
          itemStatus: newNote.status,
          newStatuses: [
            notesItemStatus.insertedUnsaved,
            notesItemStatus.insertedAfter
          ]
        }),
      });
      newNotesIndex = noteIndex;
      noteIndex++;
    }
  });

  return { newNotes, newNotesIndex };
}

function handleToggleNotesItem({ action, state }) {
  const notebookId = action.data.notebookId;
  const actionNotesItem = action.data.noteItem;
  const nowClickedNotesItem = state.notebooks[notebookId][actionNotesItem.index];
  let multSelHighEnd = null;
  let multSelLowEnd = null;

  if (state.shiftKeyPressed) {
    const highLowEnds = getHighLowEnds(
      state.lastClickedNotesItem.index, nowClickedNotesItem.index
    );
    multSelHighEnd = highLowEnds.high;
    multSelLowEnd = highLowEnds.low;
  }

  const currentNotes = state.notebooks[notebookId];
  // console.log(currentNotes);
  // - the index being saved for each note item in the redux store
  //   is not the same as the index being passed down as a prop
  //   that's why multiSelect is not working
  const {
    newNotes,
    nowClickedNotesItemUpdated,
    selectedNotesItems
  } = getToggledNewNotes({
    noteItem: nowClickedNotesItem,
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
    notebooks: {
      ...state.notebooks,
      [notebookId]: newNotes,
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
  noteItem,
  lastClickedNotesItem,
  notes,
  multSelHighEnd,
  multSelLowEnd,
  metaKeyPressed,
  selectedNotesItems,
}) {
  if (!multSelHighEnd && !metaKeyPressed) {
    return singleItemToggle(noteItem, notes, selectedNotesItems);
  }
  if (!multSelHighEnd) return metaKeySelection(noteItem, notes);

  // - We're saving the last clicked notes item's UPDATED state (it means
  //   if we clicked on the last one and it was unselected, and it became selected
  //   we save the selected state as the 'last clicked item')
  // - THEREFORE - we have to check the currently clicked item's selected state, if it's
  //   the same as the last items UPDATED state - it means they didn't start
  //   in the same selection state - so we can't multi select - it doesnt make sense
  // - shift + click has to happen on the same selected state, meaning they
  //   both should have been in the unselected state before they got clicked on
  if (noteItem.selected === lastClickedNotesItem.selected) {
    return singleItemToggle(noteItem, notes, selectedNotesItems);
  }

  // - finally - this is where the multiselect happens
  // - the notes item in the param here is the original without toggling yet,
  //   so we still want to update it's selected state, but we also want to
  //   update the selected state of everything else between the high/low index
  //   notes items to the same selected state that we're changing the clicked
  //   one to, so they all match
  return multiSelect(noteItem, notes, multSelLowEnd, multSelHighEnd);
}

// - these can become services soon
function singleItemToggle(noteItem, notes, currentSelectedNotesItems) {
  let nowClickedNotesItemUpdated = null;
  const selectedNotesItems = [];

  const newNotes = notes.map((note, index) => {
    if (index === noteItem.index) {
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
      ) newSelectedValue = !noteItem.selected;
      nowClickedNotesItemUpdated = { ...noteItem, selected: newSelectedValue };

      if (nowClickedNotesItemUpdated.selected) selectedNotesItems.push(noteItem.index);
      return nowClickedNotesItemUpdated;
    }
    return { ...note, selected: false};
  });

  return { newNotes, nowClickedNotesItemUpdated, selectedNotesItems };
}

// - this is actually a toggle now, notice how we change the selected state
//   for the 'nowClickedNotesItem' to a toggle, not hard coded 'true'
function metaKeySelection(noteItem, notes) {
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
    if (index === noteItem.index) {
      nowClickedNotesItemUpdated = { ...noteItem, selected: !noteItem.selected };
      if (nowClickedNotesItemUpdated.selected) selectedNotesItems.push(noteItem.index);
      return nowClickedNotesItemUpdated;
    }

    if (note.selected) selectedNotesItems.push(note.index);
    return note;
  });

  return { newNotes, nowClickedNotesItemUpdated, selectedNotesItems };
}

function multiSelect(noteItem, notes, lowEnd, highEnd) {
  const desiredSelectedState = !noteItem.selected;
  const selectedNotesItems = [];
  let nowClickedNotesItemUpdated = null;

  const newNotes = notes.map((note, index) => {
    if (index >= lowEnd && index <= highEnd && !note.deleted) {
      const updatedNote = { ...note, selected: desiredSelectedState};
      if (index === noteItem.index) nowClickedNotesItemUpdated = updatedNote;
      if (updatedNote.selected) selectedNotesItems.push(note.index);
      return updatedNote;
    }

    // - we need to add to the selectednotesitems here too,
    // - the if condition above applies only to new multiselect blocks, but
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
    noteItemInsertType: null,
    noteItemInsertIndex: null,
  };
}
