import { connect } from 'react-redux';
import HomePage from 'src/frontend/pages/home_page';
import { actions as notebookActions } from 'src/frontend/redux/notebooks';

export function mapStateToProps({ notebooks }) {
  return {
    notebooks: notebooks.items,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    addNotebook: (item) => dispatch(notebookActions.addNotebook(item)),
  };
}

const HomePageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);

export default HomePageContainer;
