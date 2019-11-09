import React, { PureComponent } from 'react';
import SignupModalContainer from 'src/frontend/containers/signup_modal_container';
import LoginModalContainer from 'src/frontend/containers/login_modal_container';
import {
  MODAL_NAME__LOGIN,
  MODAL_NAME__SIGNUP
} from 'src/frontend/constants/modal_names_constants';

export default class Modals extends PureComponent {
  render() {
    const { modalName } = this.props;
    if (!modalName) return null;

    switch (modalName) {
      case MODAL_NAME__LOGIN:
        return (
          <LoginModalContainer
            onClose={this.props.closeModal}
            open={!!modalName}
            openSignupModal={() => this.props.openModal({ modalName: MODAL_NAME__SIGNUP })} />
        );

      case MODAL_NAME__SIGNUP:
        return (
          <SignupModalContainer
            onClose={this.props.closeModal}
            open={!!modalName}
            openLoginModal={() => this.props.openModal({ modalName: MODAL_NAME__LOGIN })} />
        );
    }
  }
}
