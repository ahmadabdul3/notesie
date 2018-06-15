import { connect } from 'react-redux';
import LoginPage from 'src/frontend/pages/login_page';
import { actions as userActions } from 'src/frontend/redux/user';

export function mapStateToProps({ }) {
  return { };
}

export function mapDispatchToProps(dispatch) {
  return {
    loginSuccess: (data) => dispatch(userActions.loginSuccess(data)),
  };
}

const LoginPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);

export default LoginPageContainer;
