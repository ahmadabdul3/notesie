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
    const { notesItem } = this.props;

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
            <i className='fas fa-times' />
          </div>
        </div>
        { notesItem }
      </div>
    );
  }
}

export function TransientNotesItem({ notesItem}) {
  return (
    <div className='notes-item'>
      <div className='notes-item__left-indicator' />
      { notesItem }
    </div>
  );
}
