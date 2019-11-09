import { connect } from 'react-redux';
import Navigation from 'src/frontend/components/navigation';
import { actions } from 'src/frontend/redux/session';
import { actions as modalActions } from 'src/frontend/redux/modals';

export function mapStateToProps({ session }) {
  return {
    authenticated: session.authenticated,
    user: session.user,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(actions.logoutSuccess()),
    openModal: (data) => dispatch(modalActions.openModal(data)),
    closeModal: () => dispatch(modalActions.closeModal()),
  };
}

const NavigationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);

export default NavigationContainer;
