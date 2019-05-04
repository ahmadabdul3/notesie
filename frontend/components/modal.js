import React, { PureComponent } from 'react';

export default class Modal extends PureComponent {
  modalRef;

  closeModal = (e) => {
    if (this.modalRef.contains(e.target)) return;
    this.props.onClose();
  }

  render() {
    const { open, children, verticalCenter } = this.props;
    if (!open) return null;
    let klass = 'black-modal-overlay';
    if (verticalCenter) klass += ' vertical-center';

    return (
      <div className={klass} onClick={this.closeModal}>
        <div className='modal' ref={r => this.modalRef = r}>
          { children }
        </div>
      </div>
    );
  }
}
