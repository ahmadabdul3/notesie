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
    // console.log(this.props);
    // console.log(nextProps);
    return (
      this.props.text !== nextProps.text ||
      this.props.type !== nextProps.type ||
      this.props.selected !== nextProps.selected ||
      this.props.deleted !== nextProps.deleted ||
      // - this conditional applies to the case when we were editing this
      //   note item component and then we stop editing (either save or cancel)
      //   both cases require a re-render so the action buttons update
      (this.notesItemBeingEdited && !nextProps.notesItemBeingEdited) ||

      // - this conditional applies to the case when we're not editing this
      //   note item, but 'edit' was clicked on it and it will be edited
      this.notesItemWillBeEdited(nextProps)
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
    // - if there is a notes item being edited we don't want selection
    //   to work
    if (this.props.deleted) return;
    if (this.props.notesItemBeingEdited) {
      alert(`
        There is a block of notes being edited,
        please save or cancel that one before making
        other selections
      `);
      return;
    }

    const { documentId, index, selected } = this.props;
    this.props.toggleNotesItem({
      documentId,
      notesItem: {
        index,
        selected,
      },
    });
  }

  deleteItem = () => {
    if (this.anotherNotesItemBeingEdited) {
      alert(`
        There is a block of notes being edited,
        please save or cancel that one before deleting notes
      `);
      return;
    }

    // if (this.props.selectedNotesItemsExist) {
    //   alert('Unselect all notes before deleting any');
    //   return;
    // }

    const { index, deleteNotesItem, documentId } = this.props;
    deleteNotesItem({ index, documentId });
  }

  startEditItem = () => {
    // - if we're already editing this notes item, no need to fire
    //   another redux action
    if (this.notesItemBeingEdited) return;
    if (this.anotherNotesItemBeingEdited) {
      alert(`
        There is already a block of notes being edited,
        please save or cancel that one before editing
        other notes
      `);
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
    const { notesItem, index, selected, deleted } = this.props;
    console.log('notes item: ', index);


    let classname = 'notes-item';
    if (this.notesItemBeingEdited) {
      classname = 'notes-item notes-item__being-edited';
    }

    if (selected) classname = 'notes-item notes-item__selected';
    if (deleted) classname = 'notes-item notes-item__deleted';

    return (
      <div className={classname}>
        <div className='notes-item__left-indicator' />
        { this.renderActions() }
        <div className='notes-item-inner-wrapper' onClick={this.markAsSelected}>
          { notesItem }
        </div>
      </div>
    );
  }
}

export function TransientNotesItem({ notesItem }) {
  return (
    <div className='notes-item__transient'>
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
