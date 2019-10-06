import React, { PureComponent } from 'react';

export default class Modal extends PureComponent {
  modalRef;

  closeModal = (e) => {
    if (this.modalRef.contains(e.target)) return;
    this.props.onClose();
  }

  render() {
    const { open, children } = this.props;
    if (!open) return null;
    return (
      <div className='black-overlay' onClick={this.closeModal}>
        <div className='modal' ref={r => this.modalRef = r}>
          { children }
        </div>
      </div>
    );
  }
}

export class CitiModal extends PureComponent {
  render() {
    const { open, onClose, children } = this.props;
    return (
      <Modal open={open} onClose={onClose}>
        <div className='citi-modal'>
          <i className='fas fa-times' onClick={onClose} />
          { children }
        </div>
      </Modal>
    );
  }
}

export class CitiModalTitle extends PureComponent {
  render() {
    return (
      <h3 className='citi-modal__title'>
        { this.props.text }
      </h3>
    );
  }
}

export class CitiModalDescription extends PureComponent {
  render() {
    return (
      <p className='citi-modal__title-message'>
        { this.props.text }
      </p>
    );
  }
}

export class CitiModalContent extends PureComponent {
  render() {
    return (
      <div className='citi-modal__content'>
        { this.props.children }
      </div>
    );
  }
}

export class CitiModalButton extends PureComponent {
  render() {
    return (
      <button
        className='citi-modal__primary-button'
        onClick={this.props.onClick}>
        { this.props.text }
      </button>
    );
  }
}
