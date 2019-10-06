import React, { PureComponent } from 'react';
import Modal from 'src/frontend/components/modal';
import { createSession } from 'src/frontend/clients/data_api/sessions_client';
import {
  createErrorFormValidation,
  errorHasFriendlyMessage
} from 'src/services/error_manager';

const initialState = {
  email: '',
  password: '',
  formError: '',
};

export default class LoginModal extends PureComponent {
  state = { ...initialState };

  login = (e) => {
    e.preventDefault();
    const { email, password, formError } = this.state;
    if (formError) this.setState({ formError: '' });
    try {
      this.validateFormFields();
      createSession({ data: { email, password } }).then(createSessionRes => {
        this.props.loginSuccess({ user: createSessionRes.user });
        localStorage.setItem('notesie-access-token', createSessionRes.token);
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

  render() {
    const { formError } = this.state;
    const { open, onClose } = this.props;
    return (
      <Modal onClose={onClose} open={open}>
        <div className='auth-modal'>
          <i className='fas fa-times' onClick={onClose} />
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
