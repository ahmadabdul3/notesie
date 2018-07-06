import React, { Component } from 'react';

export default class NotesItem extends Component {
  constructor(props) {
    super(props);
  }

  get notesItemBeingEdited() {
    const {
      notesItemBeingEdited,
      notesItemBeingEditedId,
      index,
    } = this.props;

    return notesItemBeingEdited && notesItemBeingEditedId === index;
  }

  get anotherNotesItemBeingEdited() {
    const {
      notesItemBeingEdited,
      notesItemBeingEditedId,
      index,
    } = this.props;

    return notesItemBeingEdited && notesItemBeingEditedId !== index;
  }

  deleteItem = () => {
    if (this.anotherNotesItemBeingEdited) {
      alert('Please finish editing your notes before deleting other ones');
      return;
    }

    const { index, deleteNotesItem, documentId } = this.props;
    deleteNotesItem({ index, documentId });
  }

  startEditItem = () => {
    // - if we're already editing this notes item, no need to fire
    //   another redux action
    if (this.notesItemBeingEdited) return;
    if (this.anotherNotesItemBeingEdited) {
      alert('Please finish editing your notes before editing other ones');
      return;
    }

    const {
      index,
      startEditNotesItem,
      documentId,
    } = this.props;

    startEditNotesItem({ index, documentId });
  }

  renderCancelEditAction() {
    if (!this.notesItemBeingEdited) return;

    const { cancelEditNotesItem } = this.props;

    return (
      <div className='notes-action__cancel-edit' onClick={cancelEditNotesItem}>
        <i className='fas fa-ban' /> Cancel Edit
      </div>
    );
  }

  renderEditAction() {
    let text = 'Edit';
    let classname = 'notes-action__edit';

    if (this.notesItemBeingEdited) {
      text = 'Editing';
      classname = 'notes-action__edit__highlighted';
    }

    return (
      <div className={classname} onClick={this.startEditItem}>
        <i className='fas fa-pencil-alt' /> { text }
      </div>
    );
  }

  renderActions() {
    return (
      <div className='notes-item__actions'>
        { this.renderCancelEditAction() }
        { this.renderEditAction() }
        <div className='notes-action__delete' onClick={this.deleteItem}>
          <i className='fas fa-times' /> Delete
        </div>
      </div>
    );
  }

  render() {
    const { notesItem, index } = this.props;
    console.log('rendering note item', notesItem);

    let classname = 'notes-item';
    if (this.notesItemBeingEdited) {
      classname = 'notes-item__being-edited';
    }

    return (
      <div className={classname} onClick={this.markAsSelected}>
        <div className='notes-item__left-indicator' />
        { this.renderActions() }
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
