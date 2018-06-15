import { connect } from 'react-redux';
import HomePage from 'src/frontend/pages/home_page';
import { actions as notesDocumentsActions } from 'src/frontend/redux/notes_documents';

export function mapStateToProps({ notesDocuments }) {
  return {
    notesDocuments: notesDocuments.items,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    addNotesDocument: (item) => dispatch(notesDocumentsActions.addNotesDocument(item)),
  };
}

const HomePageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);

export default HomePageContainer;
