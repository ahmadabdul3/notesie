import React, { PureComponent } from 'react';
import Modal from 'src/frontend/components/modal';
import { createSession } from 'src/frontend/clients/data_api/sessions_client';
import {
  createErrorFormValidation,
  errorHasFriendlyMessage
} from 'src/services/error_manager';
import {
  saveAccessToken,
  userIsAuthenticated
} from 'src/frontend/services/authentication';

const initialState = {
  email: '',
  password: '',
  formError: '',
  showUserAuthError: false,
};

export default class LoginModal extends PureComponent {
  state = { ...initialState };

  login = (e) => {
    e.preventDefault();
    const { email, password, formError } = this.state;
    this.setState({ formError: '', showUserAuthError: false });
    try {
      this.validateFormFields();
      createSession({ data: { email, password } }).then(createSessionRes => {
        // - storing access token in local storage has to happen before
        //   updating the user in loginSuccess, some components depend on
        //   the access token being present to fetch data
        saveAccessToken({ accessToken: createSessionRes.token });
        this.props.loginSuccess({ user: createSessionRes.user });
        this.props.onClose();
      }).catch(e => {
        this.setState({ formError: e.friendlyMessage || 'There was an error' });
      });
    } catch (e) {
      let formError = 'There was an error';
      if (errorHasFriendlyMessage({ error: e })) formError = e.friendlyMessage;
      this.setState({ formError });
    }
  };

  validateFormFields() {
    const { email, password } = this.state;
    const formFields = [email, password];
    formFields.forEach(field => {
      if (!field.trim()) {
        const error = createErrorFormValidation({
          message: '',
          friendlyMessage: 'Please fill out all the form fields.'
        });
        throw (error);
      }
    });
  }

  resetState() {
    this.setState({ ...initialState });
  }

  componentDidUpdate() {
    if (!this.props.open) this.resetState();
  }

  change = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  switchToSignupModal = () => {
    this.props.onClose();
    this.props.openSignupModal();
  }

  close = () => {
    if (userIsAuthenticated()) this.props.onClose();
    else this.setState({ showUserAuthError: true });
  }

  render() {
    const { formError, showUserAuthError } = this.state;
    const { open } = this.props;
    return (
      <Modal onClose={this.close} open={open}>
        <div className='auth-modal'>
          <i className='fas fa-times' onClick={this.close} />
          <header className='auth-modal__header'>
            <h3 className='auth-modal__title'>
              Welcome Back
            </h3>
            <div className='auth-modal__title-underline' />
            <p className='auth-modal__title-message'>
              Log in to your Notesie account
            </p>
          </header>
          <form onSubmit={this.login} className='auth-modal__form'>
            <input
              className='input'
              name='email'
              placeholder='Email'
              onChange={this.change} />
            <input
              className='input'
              name='password'
              placeholder='Password'
              type='password'
              onChange={this.change} />
            {
              formError && (
                <div className='auth-modal__form-message'>
                  { formError }
                </div>
              )
            }
            {
              showUserAuthError && (
                <div className='auth-modal__form-message'>
                  You need an account to use Notesie. Log in if you have
                  an account, or sign up to create one
                </div>
              )
            }
            <button className='auth-modal__login-button'>
              Log In
            </button>
          </form>
          <footer className='auth-modal__footer'>
            New to Notesie? <a onClick={this.switchToSignupModal}>
              Create an Account
            </a>
          </footer>
        </div>
      </Modal>
    )
  }
}
