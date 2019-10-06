import { connect } from 'react-redux';
import SignupModal from 'src/frontend/components/signup_modal';
import { actions } from 'src/frontend/redux/session';

export function mapStateToProps() {
  return {
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    signupSuccess: (data) => dispatch(actions.signupSuccess(data)),
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupModal);

export default Container;
