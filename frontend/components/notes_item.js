import React, { Component, PureComponent } from 'react';

export default class NotesItem extends Component {
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
      this.props.noteItem.noteText !== nextProps.noteItem.noteText ||
      this.props.noteItem.formatting !== nextProps.noteItem.formatting ||
      this.props.selected !== nextProps.selected ||
      this.props.noteItem.deleted !== nextProps.noteItem.deleted ||
      // - this conditional applies to the case when we were editing this
      //   note item component and then we stop editing (either save or cancel)
      //   both cases require a re-render so the action buttons update
      (this.notesItemBeingEdited && !nextProps.notesItemBeingEdited) ||

      // - this conditional applies to the case when we're not editing this
      //   note item, but 'edit' was clicked on it and it will be edited
      this.notesItemWillBeEdited(nextProps)
    );
  }

  get notesItemData() {
    const { noteText, formatting, deleted, status } = this.props.noteItem;
    const { selected, index } = this.props;
    return { noteText, formatting, selected, deleted, index, status };
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
        save or cancel that one before making
        other selections
      `);
      return;
    }

    const { notebookId, index, selected } = this.props;
    this.props.toggleNotesItem({
      notebookId,
      noteItem: {
        index,
        selected,
      },
    });
  }

  deleteItem = () => {
    if (this.anotherNotesItemBeingEdited) {
      alert(`
        There is a block of notes being edited,
        save or cancel that one before deleting notes
      `);
      return;
    }

    const { index, deleteNotesItem, notebookId } = this.props;
    deleteNotesItem({ index, notebookId });
  }

  startEditItem = () => {
    if (this.notesItemBeingEdited) return;
    if (this.anotherNotesItemBeingEdited) {
      alert(`
        There is already a block of notes being edited,
        save or cancel that one before editing
        other notes
      `);
      return;
    }

    const {
      index,
      startEditNotesItem,
      notebookId,
    } = this.props;

    startEditNotesItem({ index, notebookId });
  }

  insertBefore = () => {
    if (this.notesItemBeingEdited || this.anotherNotesItemBeingEdited) {
      alert(`
        There is already a block of notes being edited,
        save or cancel that one before adding new notes
      `);
      return;
    }

    const { notebookId, insertBefore } = this.props;

    insertBefore({
      notebookId,
      noteItem: this.notesItemData,
      newNote: { ...this.notesItemData, noteText: '', index: -1 },
    });
  };

  insertAfter = () => {
    if (this.notesItemBeingEdited || this.anotherNotesItemBeingEdited) {
      alert(`
        There is already a block of notes being edited,
        save or cancel that one before adding new notes
      `);
      return;
    }

    const { notebookId, insertAfter } = this.props;

    insertAfter({
      notebookId,
      noteItem: this.notesItemData,
      newNote: { ...this.notesItemData, noteText: '', index: -1 },
    });
  }

  cancelEditNotesItem = () => {
    // - if the cancel is happening on notes that have a value from before
    //   then we use the old value (this is already happening)
    // - but if the cancel is happening on a new note block, like for
    //   insert before/after, then we need some text - can't cancel on
    //   empty new note block.
    // - Actually, we should just delete the new before/after note block if
    //   someone cancels
    // this.props.removeInsertedNotesBlock({ notesItemIndex: this.props.index });
    const { notebookId } = this.props;
    this.props.cancelEditNotesItem({ noteItem: this.notesItemData, notebookId });
  }

  get Actions() {
    const { startEditItem, cancelEditNotesItem, saveEdits } = this.props;

    return (
      <div className='notes-item__actions'>
        {
          this.notesItemBeingEdited ?
            null
            : (<InsertBefore clickAction={this.insertBefore} />)
        }
        {
          this.notesItemBeingEdited ?
            null
            : (<InsertAfter clickAction={this.insertAfter} />)
        }
        {
          this.notesItemBeingEdited ?
            (<CancelEdit clickAction={this.cancelEditNotesItem} />)
            : null
        }
        {
          this.notesItemBeingEdited ?
            (<SaveEdits clickAction={saveEdits} />)
            : (<StartEdit clickAction={this.startEditItem} />)
        }
        {
          this.notesItemBeingEdited ?
            null
            : (<Delete clickAction={this.deleteItem} />)
        }
      </div>
    );
  }

  get notesItemClass() {
    const { deleted } = this.props.noteItem;
    const { selected } = this.props;
    if (this.notesItemBeingEdited) return 'notes-item notes-item__being-edited';
    if (selected) return 'notes-item selected';
    if (deleted) return 'notes-item deleted';
    return 'notes-item';
  }

  render() {
    const { formattedNoteTextComponent } = this.props;

    return (
      <div className={this.notesItemClass}>
        <div className='notes-item__left-indicator' />
        { this.Actions }
        <div className='notes-item-inner-wrapper' onClick={this.markAsSelected}>
          { formattedNoteTextComponent }
        </div>
      </div>
    );
  }
}

export class TransientNotesItem extends PureComponent {
  render() {
    const { formattedNoteTextComponent, focusNoteInput } = this.props;

    return (
      <div className='notes-item__transient' onClick={focusNoteInput}>
        <div className='notes-item__left-indicator' />
        { formattedNoteTextComponent }
      </div>
    );
  }
}

class StartEdit extends PureComponent {
  render() {
    const { clickAction } = this.props;

    return (
      <div className='notes-action__edit' onClick={clickAction}>
        <i className='fas fa-pencil-alt' />
        <span>Edit</span>
      </div>
    );
  }
}

class SaveEdits extends PureComponent {
  render() {
    const { clickAction } = this.props;

    return (
      <div className='notes-action__edit__highlighted' onClick={clickAction}>
        <i className='fas fa-save' />
        <span>Save Edits</span>
      </div>
    );
  }
}

class CancelEdit extends PureComponent {
  render() {
    const { clickAction } = this.props;

    return (
      <div className='notes-action__cancel-edit' onClick={clickAction}>
        <i className='fas fa-ban' />
        <span>Cancel Edits</span>
      </div>
    );
  }
}

class Delete extends PureComponent {
  render() {
    const { clickAction } = this.props;

    return (
      <div className='notes-action__delete' onClick={clickAction}>
        <i className='fas fa-times' />
        <span>Delete</span>
      </div>
    );
  }
}

class InsertBefore extends PureComponent {
  render() {
    const { clickAction } = this.props;

    return (
      <div className='notes-action' onClick={clickAction}>
        <i className='fas fa-angle-up' />
        <span>Insert Before</span>
      </div>
    );
  };
}

class InsertAfter extends PureComponent {
  render() {
    const { clickAction } = this.props;

    return (
      <div className='notes-action' onClick={clickAction}>
        <i className='fas fa-angle-down' />
        <span>Insert After</span>
      </div>
    );
  };
}
