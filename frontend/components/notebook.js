import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import CommandList from 'src/frontend/components/command_list';
import validCommands from 'src/constants/valid_commands';
import {
  getPermanentNotesTypeComponent,
  getTransientNotesTypeComponent,
} from 'src/frontend/services/notes_items_component_resolver';
import {
  getNoteItemsForNotebbook,
  createNoteItem,
  updateNoteItem,
  insertNoteItemBefore,
  insertNoteItemAfter
} from 'src/frontend/clients/data_api/note_items_client';
// import {
//   isItemInsertedBefore,
//   isItemInsertedAfter,
// } from 'src/constants/notes_items';



// * docs
//
// - the reason for the timeouts in most places is because
//   the notes input is a textarea and when we click enter the input
//   cursor goes down to a new line - so this is what happens
//   - i type notes
//   - i click enter
//   - the notes are added and the textarea is cleared
//   - the cursor goes to a new line AFTER the textarea is clear
// - the timeout allows the cursor to go down to a new line,
//   THEN the textarea text is cleared, and the cursor stays at the top
//
// *
export default class Notebook extends PureComponent {
  noteInputRef = null;
  noteInputFocused = false;
  endOfDocument = null;
  notesTypeBeforeEditStart = '';
  notesTextBeforeEditStart = '';

  state = {
    commandListVisible: false,
    noteText: '',
    newNotesItemType: 'regular',
    // - not sure if there was a reason I put this in state, seems to make
    //   more sense if it's an instance variable instead
    noteInputTypingStarted: false,
  };

  constructor(props) {
    super(props);
    this.notebookId = props.routerProps.match.params.id;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    getNoteItemsForNotebbook({ data: { notebookId: this.notebookId } }).then(r => {
      const { noteItems } = r;
      this.props.loadAllNotes({ notebookId: this.notebookId, noteItems });
    }).catch(e => {
      console.log('e', e);
    });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  componentDidUpdate(prevProps) {
    const { notesItemBeingEdited, notesItemBeingEditedId } = this.props;
    if (
      notesItemBeingEdited &&
      notesItemBeingEditedId !== prevProps.notesItemBeingEditedId
    ) {
      const { notesList } = this.props;
      // - need to set noteInputTypingStarted to true here, otherwise
      //   when we set the noteText value to the value of the corresponding
      //   note item that's being edited, we can't backspace because this component will try to
      //   enter a formatting command, see key event hanlders to understand more
      // - another thing to note, the noteInputTypingStarted value is driven by
      //   the presence or absence of text in the note item being edited. However,
      //   there should never be existant note items without text. so the only
      //   scenario where a note item is being 'edited' but has no text is when
      //   we initially do an 'insertBefore' or 'insertAfter'. In that case
      //   we need the formatting commands to be active
      this.notesTextBeforeEditStart = this.state.noteText;
      this.notesTypeBeforeEditStart = this.state.newNotesItemType;

      this.setState({
        noteText: notesList[notesItemBeingEditedId].noteText,
        newNotesItemType: notesList[notesItemBeingEditedId].formatting,
        noteInputTypingStarted: !!notesList[notesItemBeingEditedId].noteText,
      });
      // - no need for a timout on the focus here because it's happening on
      //   mouse button click, not enter key click, so no side effects
      //   with the textarea
      this.noteInputRef.focus();
    } else if (!notesItemBeingEdited && prevProps.notesItemBeingEdited) {
      // - this happens when a user clicks 'cancel edit' when they
      //   were editing a note item, we need to set 'noteInputTypingStarted'
      //   back to false, so that tab/enter etc... commands work instead
      //   of going into typing right away
      let typingStarted = false;
      if (this.notesTextBeforeEditStart) typingStarted = true;
      this.setState({
        noteText: this.notesTextBeforeEditStart,
        newNotesItemType: this.notesTypeBeforeEditStart,
        noteInputTypingStarted: typingStarted,
      });
      this.noteInputRef.focus();
    }
  }

  // - this method was created because it needs to be passed down to some
  //   child components. That's why most places still do 'this.noteInputRef.focus();'
  //   instead of calling this method
  focusNoteInput = () => {
    this.noteInputRef.focus();
  }

  scrollToBottom = () => {
    const node = ReactDOM.findDOMNode(this.endOfDocument);
    if (node) node.scrollIntoView({ behavior: "smooth" });
  }

  registerNoteInputRef = ref => this.noteInputRef = ref;
  onNotesInputFocus = () => this.noteInputFocused = true;
  onNotesInputBlur = () => this.noteInputFocused = false;
  showCommandList = () => this.setState({ commandListVisible: true });

  insertBefore = (noteItemData) => {
    this.focusNoteInput();
    this.props.insertBefore(noteItemData);
  }

  insertAfter = (noteItemData) => {
    this.focusNoteInput();
    this.props.insertAfter(noteItemData);
  }

  onChangeNotesInput = (value) => {
    this.setState(oldState => {
      const { noteInputTypingStarted } = oldState;
      const newState = { noteText: value };

      // - this is assuming characters are bing typed in/added,
      //   meaning there's a value - if letters are being removed
      //   then there's another condition below
      if (!noteInputTypingStarted) newState.noteInputTypingStarted = true;

      // - continuing from above, if the value is empty, then
      //   we set the noteInputTypingStarted value to false, so that
      //   tab/enter work for bullet point positioning
      if (value === '') newState.noteInputTypingStarted = false;

      return newState;
    });
  }

  hideCommandList = () => {
    this.setState({ commandListVisible: false });
    setTimeout(() => { this.noteInputRef.focus(); }, 50);
  }

  updateCommand = (command) => {
    this.setState({
      newNotesItemType: command,
      commandListVisible: false,
    });
    setTimeout(() => { this.noteInputRef.focus(); }, 50);
  }

  updateEditingNotesItem = (e) => {
    e.preventDefault();
    const { noteText, newNotesItemType } = this.state;

    if (!noteText.trim()) {
      alert(`Note blocks can't be empty. If you no longer want this block of notes you can delete it`);
      return;
    }

    const { notebookId } = this;
    const index = this.props.notesItemBeingEditedId;
    const formatting = newNotesItemType;
    const noteItem = this.props.notesList[index];
    const { id } = noteItem;

    setTimeout(async () => {
      const updateResponse = await this.updateEditingNotesItemAsync();
      this.props.updateEditingNotesItem({
        updatedNoteItem: updateResponse.noteItem,
        notebookId, index, noteText, formatting
      });
      this.resetNewNotes(
        this.notesTypeBeforeEditStart,
        this.notesTextBeforeEditStart
      );
    }, 50);
  }

  updateEditingNotesItemAsync = async () => {
    const {
      notesList,
      noteItemInsertIndex,
      notesItemBeingEditedId,
      noteItemInsertType
    } = this.props;
    const { noteText, newNotesItemType } = this.state;
    const formatting = newNotesItemType;

    if (!noteItemInsertType) {
      const id = notesList[notesItemBeingEditedId].id;
      return updateNoteItem({
        data: { noteText, formatting, id }
      });
    } else {
      const noteItem = notesList[noteItemInsertIndex];
      noteItem.noteText = noteText;
      noteItem.formatting = formatting;
      // - clearing status for now,
      //   will need to distinguish between front-end status
      //   vs back-end status
      noteItem.status = undefined;

      if (noteItemInsertType === 'before') {
        const originalNoteItem = notesList[notesItemBeingEditedId + 1];
        noteItem.notebookId = originalNoteItem.notebookId;

        return insertNoteItemBefore({
          data: noteItem,
          orderOfOriginalNoteItem: originalNoteItem.order,
        });
      } else if (noteItemInsertType === 'after') {
        const originalNoteItem = notesList[notesItemBeingEditedId - 1];
        noteItem.notebookId = originalNoteItem.notebookId;

        return insertNoteItemAfter({
          data: noteItem,
          orderOfOriginalNoteItem: originalNoteItem.order,
        });
      }
    }
  };

  handleKeyUp = (e) => {
    const { key } = e;
    if (key === 'Shift') this.props.setShiftKeyUp();
    else if (key === 'Meta') this.props.setMetaKeyUp();
  }

  handleKeyDown = (e) => {
    const { key } = e;
    const { commandListVisible, noteInputTypingStarted } = this.state;
    const { notesItemBeingEdited } = this.props;
    // console.log('key ', key);

    if (commandListVisible) {
      if (key === 'Escape') {
        this.hideCommandList();
      }
    } else {
      switch (key) {
        case 'Enter':
          if (!noteInputTypingStarted) {
            this.handleEnterKey(e);
          } else if (notesItemBeingEdited) {
            this.updateEditingNotesItem(e);
          } else {
            this.addNewNotesItem(e);
          }
          return;
        case 'Escape':
          this.setState({ newNotesItemType: 'regular' });
          return;
        case 'Tab':
          this.handleTabKey(e);
          return;
        case '"':
          this.handleQuoteKey(e);
          return;
        case '-':
          this.handleDashKey(e);
          return;
        case 'Backspace':
          // - this might be annoying when erasing notes, and reach the end
          //   of the input, and it starts shifting the bullets backwards
          // - need to user test it
          // if (!noteInputTypingStarted) this.handleEnterKey(e);
          return;
        case 'Shift':
          this.handleShiftKey(e);
          return;
        case 'Meta':
          this.handleMetaKey(e);
          return;

        default: return;
      }
    }
  }

  handleMetaKey = (e) => {
    this.props.setMetaKeyDown();
  }

  handleShiftKey = (e) => {
    e.preventDefault();
    this.props.setShiftKeyDown();
  }

  handleDashKey = (e) => {
    const { noteInputTypingStarted } = this.state;

    if (!noteInputTypingStarted) {
      e.preventDefault();
      this.setState({ newNotesItemType: '-' });
    }
  }

  handleQuoteKey = (e) => {
    const { noteInputTypingStarted } = this.state;

    if (!noteInputTypingStarted) {
      e.preventDefault();
      this.setState({ newNotesItemType: '"' });
    }
  }

  handleEnterKey = (e) => {
    e.preventDefault();
    if (!this.noteInputFocused) {
      this.noteInputRef.focus();
      return;
    }
    const { newNotesItemType } = this.state;
    let itemType = newNotesItemType;

    if (newNotesItemType === '-2') itemType = '-';
    else if (newNotesItemType === '-3') itemType = '-2';
    else itemType = 'regular';

    this.setState({ newNotesItemType: itemType });
  }

  handleTabKey = (e) => {
    e.preventDefault();
    if (this.state.noteInputTypingStarted) return;
    const { newNotesItemType } = this.state;
    let itemType = newNotesItemType;

    if (newNotesItemType === 'regular') itemType = '-';
    else if (newNotesItemType === '-') itemType = '-2';
    else if (newNotesItemType === '-2') itemType = '-3';
    else if (newNotesItemType === '-3') itemType = '-';

    this.setState({ newNotesItemType: itemType });
  }

  addNewNotesItem(e) {
    e.preventDefault();
    const text = this.state.noteText.trim();

    if (!text) {
      setTimeout(() => {
        this.resetNewNotes();
      }, 50);

      return;
    }

    setTimeout(this.finishAddNewNotesItem, 50);
  }

  finishAddNewNotesItem = async () => {
    try {
      const newNotesItem = this.newNotes;
      const createResponse = await createNoteItem({ data: newNotesItem });
      this.props.addNotesItem(createResponse.noteItem);
      this.resetNewNotes();
      this.scrollToBottom();
    } catch (e) {
      console.log('e', e);
    }
  }

  get newNotes() {
    return {
      formatting: this.state.newNotesItemType,
      noteText: this.state.noteText,
      notebookId: this.notebookId,
      selected: false,
      deleted: false,
    };
  }

  resetNewNotes(formatting, noteText) {
    const newState = { noteText: '', noteInputTypingStarted: false };

    // - The following 'if' conditions pass when:
    //  1. a note item has just finished editing
    //  AND
    //  2. before editing, the transient note input had a type/text
    if (formatting) newState.newNotesItemType = formatting;
    if (noteText) {
      newState.noteText = noteText;
      newState.noteInputTypingStarted = true;
    }
    this.setState(newState);
  }

  renderExampleNotesItem() {
    // - this method shows the placeholder notes current being typed
    //   before they're added
    const { newNotesItemType, noteText } = this.state;

    const props = {
      focusNoteInput: this.focusNoteInput,
      noteItem: {
        noteText: noteText,
        formatting: newNotesItemType,
      },
    }

    if (this.props.notesItemBeingEdited) {
      props.noteItem = {
        noteText: this.notesTextBeforeEditStart,
        formatting: this.notesTypeBeforeEditStart,
      };
    }

    return getTransientNotesTypeComponent(props);
  }

  goBack = () => {
    this.props.routerProps.history.push('/');
  }

  get notesList() {
    const { notesList } = this.props;
    if (!notesList) return;

    return notesList.map((noteItem, key) => {
      const { text, type } = this.getNotesTextAndTypeToUse(noteItem, key);

      return getPermanentNotesTypeComponent({
        noteItem: {
          ...noteItem,
          noteText: text,
          formatting: type,
        },
        selected: noteItem.selected,
        key: key,
        index: noteItem.index,
        notebookId: this.notebookId,
        saveEdits: this.updateEditingNotesItem,
        insertBefore: this.insertBefore,
        insertAfter: this.insertAfter,
      });
    })
  }

  getNotesTextAndTypeToUse(noteItem, key) {
    const { notesItemBeingEdited, notesItemBeingEditedId } = this.props;
    const { noteText, newNotesItemType } = this.state;

    if (notesItemBeingEdited && notesItemBeingEditedId === key) {
      return { text: noteText, type: newNotesItemType };
    }

    return { text: noteItem.noteText, type: noteItem.formatting };
  }

  render() {
    const {
      commandListVisible,
      noteText,
      newNotesItemType,
    } = this.state;

    const { notebook } = this.props;

    return (
      <div className='note-document'>
        <div className='note-document-content'>
          <nav className='note-document-page__left-action-bar'>
            <button className='red-button' onClick={this.goBack}>
              <i className='fas fa-arrow-alt-circle-left' /> back
            </button>
          </nav>
          <div className='note-document-right-section-wrapper'>
            <div className='note-document__document-interaction-wrapper'>
              <div className='document-wrapper'>
                <div className='document'>
                  <div className='document__name'>
                    Notebook Name: <span className='note-worthy-text'>
                      { notebook.name }
                    </span>
                  </div>
                  { this.notesList }
                  { this.renderExampleNotesItem() }
                  <div
                    ref={(el) => { this.endOfDocument = el; } }
                    className='end-of-doc'
                  />
                </div>
              </div>
              <div className='note-document__interactions'>
                <div className='note-document__interactions-inner'>
                  <CommandList
                    visible={commandListVisible}
                    onSubmitCommand={this.updateCommand}
                    hideCommandList={this.hideCommandList} />
                  <FormattingDescription
                    newNotesItemType={newNotesItemType}
                    showCommandList={this.showCommandList} />
                  <NoteInput
                    value={noteText}
                    registerNoteInputRef={this.registerNoteInputRef}
                    onChange={this.onChangeNotesInput}
                    onFocus={this.onNotesInputFocus}
                    onBlur={this.onNotesInputBlur} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// <div className='document-instructions'>
//   PRESS <span className='note-worthy-text'>'ENTER'</span> TO START
//   TYPING NOTES <span className='emphasized-text'>
//   OR</span> <span className='note-worthy-text'>'SHIFT'</span> TO
//   SELECT A FORMAT
// </div>

class NoteInput extends PureComponent {
  componentDidMount() {
    this.props.registerNoteInputRef(this.textarea);
    this.textarea.focus();
  }

  onChange = (e) => {
    this.props.onChange(e.target.value);
  }

  render() {
    const { value, onFocus, onBlur } = this.props;

    return (
      <textarea
        className='notes-input'
        placeholder='Type your notes here'
        onChange={this.onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        ref={(textarea) => { this.textarea = textarea; } }
      />
    );
  }
}

class FormattingDescription extends PureComponent {
  render() {
    const { newNotesItemType, showCommandList } = this.props;

    return (
      <div className='interactions-formatting'>
        <div className='interactions-formatting-text'>
          CURRENT FORMATTING
        </div>
        <div className='interactions-formatting-label' onClick={showCommandList}>
          <span className='interactions-formatting-label__name'>
            { newNotesItemType }
          </span>
          <span className='interactions-formatting-label__icon'>
            <i className='fas fa-pencil-alt' /> Edit
          </span>
        </div>
      </div>
    );
  }
}
