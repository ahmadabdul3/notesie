import { connect } from 'react-redux';
import { NoteDocument } from 'src/frontend/components/note_document';
import { actions as notesActions } from 'src/frontend/redux/notes';

export function mapStateToProps({ notes }) {
  return {
    notesList: notes.items,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    addNotesItem: (item) => dispatch(notesActions.addNotesItem(item)),
  };
}

const NoteDocumentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteDocument);

export default NoteDocumentContainer;
