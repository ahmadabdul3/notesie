import { connect } from 'react-redux';
import Notebook from 'src/frontend/components/notebook';
import { actions as notesActions } from 'src/frontend/redux/notes';

export function mapStateToProps({ notes, notebooks }, { routerProps }) {
  const notebookId = routerProps.match.params.id;
  const empty = {
    name: "This document doesnt exist - this should only show up in development"
  };
  const notebook = notebooks.items[notebookId] || empty;

  return {
    notesList: notes.notebooks[notebookId],
    router: routerProps,
    notebook,
    notesItemBeingEdited: notes.notesItemBeingEdited,
    notesItemBeingEditedId: notes.notesItemBeingEditedId,
    notesItemBeingEditedNotebookId: notes.notesItemBeingEditedDocumentId,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    loadAllNotes: (data) => dispatch(notesActions.loadAllNotes(data)),
    addNotesItem: (item) => dispatch(notesActions.addNotesItem(item)),
    updateEditingNotesItem: (item) => dispatch(notesActions.finishEditNotesItem(item)),
    setShiftKeyUp: () => dispatch(notesActions.setShiftKeyUp()),
    setShiftKeyDown: () => dispatch(notesActions.setShiftKeyDown()),
    setMetaKeyUp: () => dispatch(notesActions.setMetaKeyUp()),
    setMetaKeyDown: () => dispatch(notesActions.setMetaKeyDown()),
    insertBefore: (data) => dispatch(notesActions.insertNotesBefore(data)),
    insertAfter: (data) => dispatch(notesActions.insertNotesAfter(data)),
  };
}

const NotebookContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Notebook);

export default NotebookContainer;
