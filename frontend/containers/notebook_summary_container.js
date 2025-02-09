import { connect } from 'react-redux';
import NotebookSummary from 'src/frontend/components/notebook_summary';

export function mapStateToProps({ notes }, { data }) {
  const notebooks = notes.notebooks[data.id] || [];
  return {
    notesList: notebooks.slice(0, 3),
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
