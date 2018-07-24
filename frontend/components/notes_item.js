import React, { Component } from 'react';

export default class NotesItem extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // - this causes the component not to re-render if the text or type
    //   (type means formatting) of the notes item doesnt change, which is
    //   great for performance and wasted renders, but it causes the
    //   note action buttons to always render because a re-render doesn't occur
    // - performance is more important here than anything else, so we can keep
    //   the buttons displayed on hover, and just alert the user that they
    //   have to finish editing before editing another
    return (
      this.props.text !== nextProps.text ||
      this.props.type !== nextProps.type ||
      // - this conditional applies to the case when we were editing this
      //   note item component and then we stop editing (either save or cancel)
      //   both cases require a re-render so the action buttons update
      (this.notesItemBeingEdited && !nextProps.notesItemBeingEdited) ||

      // - this conditional applies to the case when we're not editing this
      //   note item, but 'edit' was clicked on it and it will be edited
      (!this.notesItemBeingEdited && this.notesItemWillBeEdited(nextProps))
    );
  }

  notesItemWillBeEdited(nextProps) {
    const { index } = this.props;
    const { notesItemBeingEdited, notesItemBeingEditedId } = nextProps;

    return (
      !this.notesItemBeingEdited &&
      (notesItemBeingEdited && notesItemBeingEditedId === index)
    );
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

  markAsSelected = () => {
    // - currently this is on the top level element in the render function
    //   so it runs even when the action buttons are clicked like 'edit'
    // - We should create a wrapper around the notes item child and put the
    //   click event on that, so that this function only executes when we
    //   click on the wrapper
    // console.log('marking as selected');
    // actual implementation coming...
  }

  deleteItem = () => {
    if (this.anotherNotesItemBeingEdited) {
      alert('You can only modify one block of notes at a time');
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
      alert('You can only modify one block of notes at a time');
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
        <i className='fas fa-ban' />
        <span>
          Cancel Edits
        </span>
      </div>
    );
  }

  renderEditAction() {
    if (this.notesItemBeingEdited) {
      const editActionProps = {
        text: 'Save Edits',
        classname: 'notes-action__edit__highlighted',
        icon: 'fas fa-save',
        clickAction: this.props.saveEdits,
      };

      return <EditAction {...editActionProps} />;
    }

    return <EditAction clickAction={this.startEditItem} />;
  }

  renderActions() {
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

export function TransientNotesItem({ notesItem }) {
  return (
    <div className='notes-item'>
      <div className='notes-item__left-indicator' />
      { notesItem }
    </div>
  );
}

export function EditAction({ text, classname, icon, clickAction }) {
  return (
    <div className={classname} onClick={clickAction}>
      <i className={`${icon}`} />
      <span>
        { text }
      </span>
    </div>
  );
}

EditAction.defaultProps = {
  text: 'Edit',
  classname: 'notes-action__edit',
  icon: 'fas fa-pencil-alt',
};
