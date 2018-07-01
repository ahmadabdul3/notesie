import { connect } from 'react-redux';
import NoteDocument from 'src/frontend/components/note_document';
import { actions as notesActions } from 'src/frontend/redux/notes';

export function mapStateToProps({ notes, notesDocuments }, { routerProps }) {
  const documentId = routerProps.match.params.id;
  const empty = {
    name: "This document doesnt exist - this should only show up in development"
  };
  const noteDocument = notesDocuments.items[documentId] || empty;

  return {
    notesList: notes.documents[documentId],
    router: routerProps,
    noteDocument,
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
