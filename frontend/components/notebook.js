import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import CommandList from 'src/frontend/components/command_list';
import validCommands from 'src/constants/valid_commands';
import {
  getPermanentNotesTypeComponent,
  getTransientNotesTypeComponent,
} from 'src/frontend/services/notes_items_component_resolver';


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
    notesText: '',
    newNotesItemType: 'regular',
    // - not sure if there was a reason I put this in state, seems to make
    //   more sense if it's an instance variable instead
    noteInputTypingStarted: false,
  };

  constructor(props) {
    super(props);
    this.documentId = props.routerProps.match.params.id;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
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
      this.notesTextBeforeEditStart = this.state.notesText;
      this.notesTypeBeforeEditStart = this.state.newNotesItemType;
      this.setState({
        notesText: notesList[notesItemBeingEditedId].notesText,
        newNotesItemType: notesList[notesItemBeingEditedId].notesType,
        noteInputTypingStarted: !!notesList[notesItemBeingEditedId].notesText,
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
        notesText: this.notesTextBeforeEditStart,
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
    const { insertBefore } = this.props;
    this.focusNoteInput();
    insertBefore(noteItemData);
  }

  insertAfter = (noteItemData) => {
    const { insertAfter } = this.props;
    this.focusNoteInput();
    insertAfter(noteItemData);
  }

  onChangeNotesInput = (value) => {
    this.setState(oldState => {
      const { noteInputTypingStarted } = oldState;
      const newState = { notesText: value };

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
    const { notesText, newNotesItemType } = this.state;

    if (!notesText.trim()) {
      alert(`Note blocks can't be empty. If you no longer want this block of notes you can delete it`);
      return;
    }

    const { documentId } = this;
    const index = this.props.notesItemBeingEditedId;

    setTimeout(() => {
      this.props.updateEditingNotesItem({
        documentId, index, notesText, notesType: newNotesItemType
      });
      this.resetNewNotes(
        this.notesTypeBeforeEditStart,
        this.notesTextBeforeEditStart
      );
    }, 50);
  }

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
    const text = this.state.notesText.trim();

    if (!text) {
      setTimeout(() => {
        this.resetNewNotes();
      }, 50);

      return;
    }

    setTimeout(this.finishAddNewNotesItem, 50);
  }

  finishAddNewNotesItem = () => {
    this.props.addNotesItem(this.newNotes);
    this.resetNewNotes();
    this.scrollToBottom();
  }

  get newNotes() {
    return {
      notesType: this.state.newNotesItemType,
      notesText: this.state.notesText,
      documentId: this.documentId,
      selected: false,
      deleted: false,
    };
  }

  resetNewNotes(notesType, notesText) {
    const newState = { notesText: '', noteInputTypingStarted: false };

    // - I think these if conditions pass when a note item is finished
    //   editing, and before editing, the transient note input had a
    //   type, and text typed into it
    if (notesType) newState.newNotesItemType = notesType;
    if (notesText) {
      newState.notesText = notesText;
      newState.noteInputTypingStarted = true;
    }
    this.setState(newState);
  }

  renderExampleNotesItem() {
    // - this method shows the placeholder notes current being typed
    //   before they're added
    const { newNotesItemType, notesText } = this.state;

    const props = {
      focusNoteInput: this.focusNoteInput,
      noteBlock: {
        notesText: notesText,
        notesType: newNotesItemType,
      },
    }

    if (this.props.notesItemBeingEdited) {
      props.noteBlock = {
        notesText: this.notesTextBeforeEditStart,
        notesType: this.notesTypeBeforeEditStart,
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

    return notesList.map((notesItem, key) => {
      const { text, type } = this.getNotesTextAndTypeToUse(notesItem, key);

      return getPermanentNotesTypeComponent({
        noteBlock: {
          notesType: type,
          notesText: text,
          deleted: notesItem.deleted,
          documentId: this.documentId,
          status: notesItem.status,
          id: notesItem.index,
        },
        selected: notesItem.selected,
        key: key,
        index: notesItem.index,
        documentId: this.documentId,
        saveEdits: this.updateEditingNotesItem,
        insertBefore: this.insertBefore,
        insertAfter: this.insertAfter,
      });
    })
  }

  getNotesTextAndTypeToUse(notesItem, key) {
    const { notesItemBeingEdited, notesItemBeingEditedId } = this.props;
    const { notesText, newNotesItemType } = this.state;

    if (notesItemBeingEdited && notesItemBeingEditedId === key) {
      return { text: notesText, type: newNotesItemType };
    }

    return { text: notesItem.notesText, type: notesItem.notesType };
  }

  render() {
    const {
      commandListVisible,
      notesText,
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
                    value={notesText}
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
