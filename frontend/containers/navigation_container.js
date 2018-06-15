import { connect } from 'react-redux';
import Navigation from 'src/frontend/components/navigation';
import { actions as userActions } from 'src/frontend/redux/user';

export function mapStateToProps({  }) {
  return {
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    clearUser: () => dispatch(userActions.clearUser()),
  };
}

const NavigationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);

export default NavigationContainer;
