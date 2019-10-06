import { connect } from 'react-redux';
import Navigation from 'src/frontend/components/navigation';
import { actions } from 'src/frontend/redux/session';

export function mapStateToProps({ session }) {
  return {
    authenticated: session.authenticated,
    user: session.user,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(actions.logoutSuccess()),
  };
}

const NavigationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);

export default NavigationContainer;
