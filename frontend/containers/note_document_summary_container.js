import { connect } from 'react-redux';
import NoteDocumentSummary from 'src/frontend/components/note_document_summary';

export function mapStateToProps({ notes }, { data }) {
  const documents = notes.documents[data.id] || [];
  return {
    notesList: documents.slice(0, 3),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
  };
}

const NoteDocumentSummaryContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteDocumentSummary);

export default NoteDocumentSummaryContainer;
