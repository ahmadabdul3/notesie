import React, { Component } from 'react';
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
export default class NoteDocument extends Component {
  noteInputRef = null;
  endOfDocument = null;
  notesTypeBeforeEditStart = '';

  state = {
    commandListVisible: false,
    notesText: '',
    newNotesItemType: 'regular',
    noteInputTypingStarted: false,
  };

  constructor(props) {
    super(props);
    this.documentId = props.routerProps.match.params.id;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
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
      //   note item, we can't backspace because this component will try to
      //   enter a formatting command, see key event hanlders to understand more
      this.notesTypeBeforeEditStart = this.state.newNotesItemType;
      this.setState({
        notesText: notesList[notesItemBeingEditedId].notesText,
        newNotesItemType: notesList[notesItemBeingEditedId].notesType,
        noteInputTypingStarted: true,
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
      this.setState({
        notesText: '',
        newNotesItemType: this.notesTypeBeforeEditStart,
        noteInputTypingStarted: false,
      });
      this.noteInputRef.focus();
    }
  }

  scrollToBottom = () => {
    const node = ReactDOM.findDOMNode(this.endOfDocument);
    if (node) {
      node.scrollIntoView({ behavior: "smooth" });
    }
  }

  registerNoteInputRef = (ref) => {
    this.noteInputRef = ref;
  }

  showCommandList = () => {
    this.setState({ commandListVisible: true });
  }

  onChangeNotesInput = (value) => {
    const { noteInputTypingStarted } = this.state;
    const newState = { notesText: value };

    if (!noteInputTypingStarted) {
      // - this is assuming characters are bing typed in/added,
      //   meaning there's a value - if letters are being removed
      //   then there's another condition below
      newState.noteInputTypingStarted = true;
    }

    if (value === '') {
      // - continuing from above, if the value is empty, then
      //   we set the noteInputTypingStarted value to false, so that
      //   tab/enter work for bullet point positioning
      newState.noteInputTypingStarted = false;
    }

    this.setState(newState);
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
    // - for some reason when being edit starts going, I can
    //   only add text, not delete any text, need to investigate that
    const { documentId } = this;
    const index = this.props.notesItemBeingEditedId;
    const { notesText, newNotesItemType } = this.state;

    setTimeout(() => {
      this.props.updateEditingNotesItem({
        documentId, index, notesText, notesType: newNotesItemType
      });
      this.resetNewNotes(this.notesTypeBeforeEditStart);
    }, 50);
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
            this.updateEditingNotesItem();
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
          if (!noteInputTypingStarted) this.handleEnterKey(e);
          return;
      }
    }
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

    const newNotes = {
      notesType: this.state.newNotesItemType,
      notesText: this.state.notesText,
      documentId: this.documentId,
    };

    setTimeout(() => {
      this.props.addNotesItem(newNotes);
      this.resetNewNotes();
      this.scrollToBottom();
    }, 50);
  }

  resetNewNotes(notesType) {
    const newState = { notesText: '', noteInputTypingStarted: false };
    if (notesType) newState.newNotesItemType = notesType;
    this.setState(newState);
  }

  renderNewNotesItem() {
    // - this method shows the placeholder notes current being typed
    //   before they're added
    if (this.props.notesItemBeingEdited) return;

    const { newNotesItemType, notesText } = this.state;
    return getTransientNotesTypeComponent({
      type: newNotesItemType,
      text: notesText || <NewNoteLinePlaceholder />
    });
  }

  render() {
    const {
      commandListVisible,
      notesText,
      newNotesItemType,
    } = this.state;

    const { notesList, noteDocument } = this.props;

    return (
      <div className='note-document'>
        <div className='note-document__notes'>
          <div className='document'>
            <div className='document__name'>
              Document name: <span className='note-worthy-text'>
                { noteDocument.name }
              </span>
            </div>
            {
              notesList && notesList.map((notesItem, key) => {
                const { notesItemBeingEdited, notesItemBeingEditedId } = this.props;
                let notesTextToUse = notesItem.notesText;
                let notesTypeToUse = notesItem.notesType;
                if (notesItemBeingEdited && notesItemBeingEditedId === key) {
                  notesTextToUse = notesText;
                  notesTypeToUse = newNotesItemType;
                }
                return getPermanentNotesTypeComponent({
                  type: notesTypeToUse,
                  text: notesTextToUse,
                  key: key,
                  documentId: this.documentId,
                  saveEdits: this.updateEditingNotesItem,
                });
              })
            }
            {
              this.renderNewNotesItem()
            }
            <div ref={(el) => { this.endOfDocument = el; } } />
          </div>
        </div>
        <div className='note-document__interactions'>
          <div className='note-document-interactions'>
            {
              commandListVisible ? (
                <CommandList
                  onSubmitCommand={this.updateCommand}
                  hideCommandList={this.hideCommandList} />
              ) : null
            }
            <FormattingDescription
              newNotesItemType={newNotesItemType}
              showCommandList={this.showCommandList} />
            <NoteInput
              value={notesText}
              registerNoteInputRef={this.registerNoteInputRef}
              onChange={this.onChangeNotesInput} />
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

class NoteInput extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.registerNoteInputRef(this.textarea);
    this.textarea.focus();
  }

  onChange = (e) => {
    this.props.onChange(e.target.value);
  }

  render() {
    const { value } = this.props;

    return (
      <textarea
        className='notes-input'
        placeholder='Type your notes here'
        onChange={this.onChange}
        value={value}
        ref={(textarea) => { this.textarea = textarea; } } />
    );
  }
}

function FormattingDescription({ newNotesItemType, showCommandList }) {
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

function NewNoteLinePlaceholder() {
  return (
    <div className='new-note-line-placeholder'>
      This is how your notes will appear, start typing
      to add your own
    </div>
  )
}
