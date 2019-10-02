import { connect } from 'react-redux';
import NotebookSummary from 'src/frontend/components/notebook_summary';

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

const NotebookSummaryContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotebookSummary);

export default NotebookSummaryContainer;
