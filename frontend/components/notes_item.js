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
    const { index, deleteNotesItem, documentId } = this.props;
    deleteNotesItem({ index, documentId });
  }

  startEditItem = () => {
    // - if we're already editing this notes item, no need to fire
    //   another redux action
    if (this.notesItemBeingEdited) return;

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
        <i className='fas fa-ban' />
        <span>
          Cancel Edits
        </span>
      </div>
    );
  }

  renderEditAction() {
    // - this will need to be broken down into a separate component
    //   instead of continuing to do this variable reassignment
    let text = 'Edit';
    let classname = 'notes-action__edit';
    let icon = 'fas fa-pencil-alt';
    let clickAction = this.startEditItem;

    if (this.notesItemBeingEdited) {
      text = 'Save Edits';
      classname = 'notes-action__edit__highlighted';
      icon = 'fas fa-save';
      clickAction = this.props.saveEdits;
    }

    return (
      <div className={classname} onClick={clickAction}>
        <i className={`${icon}`} />
        <span>
          { text }
        </span>
      </div>
    );
  }

  renderActions() {
    if (this.anotherNotesItemBeingEdited) return;

    return (
      <div className='notes-item__actions'>
        { this.renderCancelEditAction() }
        { this.renderEditAction() }
        <div className='notes-action__delete' onClick={this.deleteItem}>
          <i className='fas fa-times' />
          <span>
            Delete
          </span>
        </div>
      </div>
    );
  }

  render() {
    const { notesItem, index } = this.props;

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
