import { connect } from 'react-redux';
import LoginModal from 'src/frontend/components/login_modal';
import { actions } from 'src/frontend/redux/session';

export function mapStateToProps() {
  return {
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    loginSuccess: (data) => dispatch(actions.loginSuccess(data)),
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginModal);

export default Container;
