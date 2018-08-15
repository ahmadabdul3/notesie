import React, { Component, PureComponent } from 'react';

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
      this.props.notesText !== nextProps.notesText ||
      this.props.notesType !== nextProps.notesType ||
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

  get notesItemData() {
    const { notesText, notesType, selected, deleted, index } = this.props;
    return { notesText, notesType, selected, deleted, index };
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

  insertBefore = () => {
    console.log('props', this.props);
    const { documentId, insertBefore } = this.props;
    insertBefore({
      documentId,
      notesItem: this.notesItemData,
      newNote: { ...this.notesItemData, notesText: 'new note' },
    });
  };

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
    const { insertBefore, insertAfter } = this;

    return (
      <div className='notes-item__actions'>
        <InsertBefore clickAction={insertBefore} />
        <InsertAfter clickAction={insertAfter} />
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

  get notesItemClass() {
    const { selected, deleted } = this.props;
    if (this.notesItemBeingEdited) return 'notes-item notes-item__being-edited';
    if (selected) return 'notes-item selected';
    if (deleted) return 'notes-item deleted';
    return 'notes-item';
  }

  render() {
    const { notesItem, index } = this.props;
    console.log('notes item: ', index);

    return (
      <div className={this.notesItemClass}>
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

export class EditAction extends PureComponent {
  static defaultProps = {
    text: 'Edit',
    classname: 'notes-action__edit',
    icon: 'fas fa-pencil-alt',
  };

  render() {
    const { text, classname, icon, clickAction } = this.props;

    return (
      <div className={classname} onClick={clickAction}>
        <i className={`${icon}`} />
        <span>
          { text }
        </span>
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
        <span>
          Insert Before
        </span>
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
        <span>
          Insert After
        </span>
      </div>
    );
  };
}
