import { connect } from 'react-redux';
import NoteDocument from 'src/frontend/components/note_document';
import { actions as notesActions } from 'src/frontend/redux/notes';

export function mapStateToProps({ notes }, { routerProps }) {
  const documentId = routerProps.match.params.id;

  return {
    notesList: notes.documents[documentId],
    router: routerProps,
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
