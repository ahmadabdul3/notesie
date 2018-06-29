import React, { Component } from 'react';
import CommandList from 'src/frontend/components/command_list';
import validCommands from 'src/constants/valid_commands';
import getNotesTypeComponent from 'src/frontend/services/notes_items_component_resolver';

export default class NoteDocument extends Component {
  state = {
    commandStarted: false,
    commandText: '',
    notesText: '',
    newNotesItemType: 'regular',
    newNoteItemStarted: false,
    // notesList: [],
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

  onSubmitCommand = () => {
    console.log('resolving command submit');
    const { commandText } = this.state;
    this.resolveCommand(commandText);
    this.setState({ commandText: '', commandStarted: false });
  }

  onChangeCommand = (value) => {
    this.setState({ commandText: value });
  }

  onChangeNotesInput = (value) => {
    const { newNoteItemStarted } = this.state;
    const newState = { notesText: value };

    if (!newNoteItemStarted) {
      newState.newNoteItemStarted = true;
    }

    this.setState(newState);
  }

  handleKeyDown = (e) => {
    const { key } = e;
    const { commandStarted, commandText } = this.state;
    // console.log('key ', key);

    if (commandStarted) {
      if (key === 'Enter') {
        this.onSubmitCommand();
      } else if (key === 'Escape') {
        this.setState({ commandText: '', commandStarted: false });
      }
    } else {
      if (key === 'Enter') {
        this.addNewNotesItem();
      }
    }
  }

  addNewNotesItem() {
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
    }, 50);
  }

  resetNewNotes(resetNotesItemType) {
    const newState = { notesText: '', newNoteItemStarted: false };
    if (resetNotesItemType) newState.newNotesItemType = 'regular';
    this.setState(newState);
  }

  renderNewNotesItem() {
    if (!this.state.newNoteItemStarted) return;
    const { newNotesItemType, notesText } = this.state;
    return getNotesTypeComponent({ type: newNotesItemType, text: notesText });
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
      commandStarted,
      commandText,
      notesText,
      newNotesItemType,
    } = this.state;

    const { notesList } = this.props;

    return (
      <div className='note-document'>
        <div className='note-document__notes'>
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
        </div>
        <div className='note-document__interactions'>
          <div className='note-document-interactions'>
            {
              commandStarted ? (
                <CommandList
                  commandText={commandText}
                  onSubmitCommand={this.onSubmitCommand}
                  onChangeCommand={this.onChangeCommand} />
              ) : null
            }
            <div className='interactions-formatting'>
              CURRENT FORMATTING { newNotesItemType }
            </div>
            <NoteInput
              value={notesText}
              onChange={this.onChangeNotesInput} />
          </div>
        </div>
      </div>
    );
  }
}

// <div className='document-instructions'>
//   PRESS <span className='note-worthy-text'>'ENTER'</span> TO START
//   TYPING NOTES <span className='emphasized-text'>OR</span> <span className='note-worthy-text'>'SHIFT'</span> TO
//   SELECT A FORMAT
// </div>

class NoteInput extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
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
