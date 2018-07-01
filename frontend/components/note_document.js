import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CommandList from 'src/frontend/components/command_list';
import validCommands from 'src/constants/valid_commands';
import getNotesTypeComponent from 'src/frontend/services/notes_items_component_resolver';


// * docs
//
// -- the reason for the timeouts in most places is the following:
// - the notes input is a textarea and when we click enter the input
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

  state = {
    showCommandList: false,
    commandText: '',
    notesText: '',
    newNotesItemType: 'regular',
    newNoteItemStarted: false,
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
    this.setState({ showCommandList: true });
  }

  onSubmitCommand = () => {
    console.log('resolving command submit');
    const { commandText } = this.state;
    this.resolveCommand(commandText);
    setTimeout(() => { this.noteInputRef.focus(); }, 50);
    this.setState({ commandText: '', showCommandList: false });
  }

  onChangeCommand = (value) => {
    this.setState({ commandText: value });
  }

  onChangeNotesInput = (value) => {
    const { newNoteItemStarted } = this.state;
    const newState = { notesText: value };

    if (!newNoteItemStarted) {
      // - this is assuming letters are bing typed in,
      //   meaning there's a value - if letters are being removed
      //   then there's another condition below
      newState.newNoteItemStarted = true;
    }

    if (value === '') {
      // - continuing from above, if the value is empty, then
      //   we set the newNoteItemStarted value to false, so that
      //   tab/enter work for bullet point positioning
      newState.newNoteItemStarted = false;
    }

    this.setState(newState);
  }

  hideCommandList = () => {
    this.setState({ commandText: '', showCommandList: false });
  }

  handleKeyDown = (e) => {
    const { key } = e;
    const { showCommandList, commandText, newNoteItemStarted } = this.state;
    // console.log('key ', key);

    if (showCommandList) {
      if (key === 'Enter') {
        this.onSubmitCommand();
      } else if (key === 'Escape') {
        this.hideCommandList();
      }
    } else {
      if (key === 'Enter') {
        if (!newNoteItemStarted) {
          this.handleEnterKey(e);
        } else {
          this.addNewNotesItem(e);
        }
      } else if (key === 'Escape') {
        this.setState({ newNotesItemType: 'regular' });
      } else if (key === 'Tab') {
        this.handleTabKey(e);
      }
    }
  }

  handleEnterKey = (e) => {
    e.preventDefault();
    const { newNotesItemType } = this.state;
    let itemType = newNotesItemType;

    if (newNotesItemType === '-2') itemType = '-';
    else if (newNotesItemType === '-3') itemType = '-2';

    this.setState({ newNotesItemType: itemType });
  }

  handleTabKey = (e) => {
    e.preventDefault();
    if (this.state.newNoteItemStarted) return;
    const { newNotesItemType } = this.state;
    let itemType = newNotesItemType;

    if (newNotesItemType === '-') itemType = '-2';
    else if (newNotesItemType === '-2') itemType = '-3';

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

  resetNewNotes(resetNotesItemType) {
    const newState = { notesText: '', newNoteItemStarted: false };
    if (resetNotesItemType) newState.newNotesItemType = 'regular';
    this.setState(newState);
  }

  renderNewNotesItem() {
    // if (!this.state.newNoteItemStarted) return;
    const { newNotesItemType, notesText } = this.state;
    return getNotesTypeComponent({
      type: newNotesItemType,
      text: notesText || <NewNoteLinePlaceholder />
    });
  }

  resolveCommand(command) {
    // - this should become a pure function, shouldn't mutate the state
    //   just return whether the command was valid or not
    const trimmedCommand = command.trim();
    if (validCommands[trimmedCommand]) {
      console.log('valid command: ', trimmedCommand);
      setTimeout(() => {
        this.setState({ newNotesItemType: trimmedCommand });
      }, 50);
    } else if (trimmedCommand === '') {
      setTimeout(() => {
        this.setState({ newNotesItemType: 'regular' });
      }, 50);
    } else {
      console.log('invalid command: ', trimmedCommand);
    }
  }

  render() {
    const {
      showCommandList,
      commandText,
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
                const { notesType, notesText } = notesItem;
                return getNotesTypeComponent({
                  type: notesType, text: notesText,
                  key: key, documentId: this.documentId,
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
              showCommandList ? (
                <CommandList
                  commandText={commandText}
                  onSubmitCommand={this.onSubmitCommand}
                  onChangeCommand={this.onChangeCommand}
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
        <span>
          { newNotesItemType }
        </span>
        <i className='fas fa-pencil-alt' />
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
