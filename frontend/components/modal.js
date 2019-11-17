import React, { PureComponent } from 'react';

export default class Modal extends PureComponent {
  modalRef;

  closeModal = (e) => {
    if (this.modalRef.contains(e.target)) return;
    this.props.onClose();
  }

  render() {
    const { open, children, customClass, onClose } = this.props;
    if (!open) return null;
    return (
      <div className='black-overlay' onClick={this.closeModal}>
        <div className={`modal ${customClass}`} ref={r => this.modalRef = r}>
          <i className='fas fa-times' onClick={onClose} />
          { children }
        </div>
      </div>
    );
  }
}

export class ModalTitle extends PureComponent {
  render() {
    return (
      <h3 className='modal__title'>
        { this.props.text }
      </h3>
    );
  }
}

export class ModalDescription extends PureComponent {
  render() {
    return (
      <p className='modal__title-message'>
        { this.props.text }
      </p>
    );
  }
}

export class ModalContent extends PureComponent {
  render() {
    return (
      <div className='modal__content'>
        { this.props.children }
      </div>
    );
  }
}

export class ModalButton extends PureComponent {
  render() {
    return (
      <button
        className='modal__primary-button'
        onClick={this.props.onClick}>
        { this.props.text }
      </button>
    );
  }
}
