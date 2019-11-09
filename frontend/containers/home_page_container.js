import { connect } from 'react-redux';
import HomePage from 'src/frontend/pages/home_page';
import {
  addNotebook,
  loadNotebooks,
} from 'src/frontend/redux/notebooks';

export function mapStateToProps({ notebooks, session }) {
  return {
    notebooks: Object.keys(notebooks.items).map(nk => notebooks.items[nk]),
    userAuthenticated: session.authenticated,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    addNotebook: (item) => dispatch(addNotebook(item)),
    loadNotebooks: (notebooks) => dispatch(loadNotebooks(notebooks)),
  };
}

const HomePageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);

export default HomePageContainer;
