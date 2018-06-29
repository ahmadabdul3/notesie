import React, { Component } from 'react';

export default class NotesItem extends Component {
  constructor(props) {
    super(props);
  }

  deleteItem = () => {
    const { index, deleteNotesItem, documentId } = this.props;
    deleteNotesItem({ index, documentId });
  }

  render() {
    const { children } = this.props;

    return (
      <div className='notes-item' onClick={this.markAsSelected}>
        <div className='notes-item__left-indicator' />
        <div className='notes-item__actions'>
          {
            // <div className='notes-action__clone'>
            //   <i className='fa fa-clone' />
            // </div>
          }
          <div className='notes-action__delete' onClick={this.deleteItem}>
            <i className='fa fa-times' />
          </div>
        </div>
        { children }
      </div>
    );
  }
}
