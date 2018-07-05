import { connect } from 'react-redux';
import NotesItem from 'src/frontend/components/notes_item';
import { actions as notesActions } from 'src/frontend/redux/notes';

export function mapStateToProps({ notes }) {
  return {
    notesItemBeingEdited: notes.notesItemBeingEdited,
    notesItemBeingEditedId: notes.notesItemBeingEditedId,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    deleteNotesItem: (item) => dispatch(notesActions.deleteNotesItem(item)),
    startEditNotesItem: (item) => dispatch(notesActions.startEditNotesItem(item)),
    cancelEditNotesItem: () => dispatch(notesActions.cancelEditNotesItem()),
  };
}

const NotesItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotesItem);

export default NotesItemContainer;
