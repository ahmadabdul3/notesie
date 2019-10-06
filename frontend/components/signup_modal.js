import React, { Component, PureComponent } from 'react';
import Modal from 'src/frontend/components/modal';
import { createUser } from 'src/frontend/clients/data_api/users_client';
import {
  createErrorFormValidation,
  errorHasFriendlyMessage
} from 'src/services/error_manager';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  formError: '',
};

export default class SignupModal extends PureComponent {
  state = { ...initialState };

  signup = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, formError } = this.state;
    if (formError) this.setState({ formError: '' });
    try {
      this.validateFormFields();
      const user = { firstName, lastName, email, password };
      createUser({ data: user }).then(createUserRes => {
        this.props.signupSuccess({ user: createUserRes.user });
        localStorage.setItem('notesie-access-token', createUserRes.token);
        this.props.onClose();
      }).catch(er => {
        this.setFormError({ error: er });
      });
    } catch (e) {
      this.setFormError({ error: e });
    }
  };

  setFormError({ error }) {
    let formError = 'There was an error';
    if (errorHasFriendlyMessage({ error })) formError = error.friendlyMessage;
    this.setState({ formError });
  }

  validateFormFields() {
    const { firstName, lastName, email, password } = this.state;
    const formFields = [firstName, lastName, email, password];
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

  switchToLoginModal = () => {
    this.props.onClose();
    this.props.openLoginModal();
  }

  render() {
    const { open, onClose } = this.props;
    const { formError } = this.state;
    return (
      <Modal onClose={onClose} open={open}>
        <div className='auth-modal'>
          <i className='fas fa-times' onClick={onClose} />
          <header className='auth-modal__header'>
            <h3 className='auth-modal__title'>
              Welcome To Notesie
            </h3>
            <div className='auth-modal__title-underline' />
            <p className='auth-modal__title-message'>
              Sign Up for an account
            </p>
          </header>
          <form onSubmit={this.signup} className='auth-modal__form'>
            <div className='half-input-box'>
              <input
                className='input'
                name='firstName'
                placeholder='First Name'
                onChange={this.change} />
              <input
                className='input'
                name='lastName'
                placeholder='Last Name'
                onChange={this.change} />
            </div>
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
              Sign Up
            </button>
          </form>
          <footer className='auth-modal__footer'>
            Already have an account? <a onClick={this.switchToLoginModal}>
              Log In
            </a>
          </footer>
        </div>
      </Modal>
    )
  }
}
