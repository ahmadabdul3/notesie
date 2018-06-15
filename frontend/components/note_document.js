import React, { Component } from 'react';
import CommandList from 'src/frontend/components/command_list';
import validCommands from 'src/frontend/constants/valid_commands';
import getNotesTypeComponent from 'src/frontend/services/notes_items_component_resolver';

export class NoteDocument extends Component {
  state = {
    commandStarted: false,
    notesInputVisible: false,
    commandText: '',
    notesText: '',
    newNotesItemType: '',
    // notesList: [],
  };

  constructor(props) {
    super(props);
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
    this.setState({ notesText: value });
  }

  handleKeyDown = (e) => {
    const { key } = e;
    const { commandStarted, commandText, notesInputVisible } = this.state;
    // console.log('key ', key);

    if (commandStarted) {
      if (key === 'Escape') {
        this.setState({ commandText: '', commandStarted: false });
      }
    } else if (notesInputVisible) {
      if (key === 'Escape') {
        this.resetNewNotes();
      } else if (key === 'Enter') {
        this.addNewNotesItem();
      }
    } else {
      if (key === 'Enter') {
        console.log('regular notes');
        // - timeout is set here because the enter key is also captured
        //   by the textarea, which is making the cursor appear on the
        //   second line instead of the first line of the input
        setTimeout(() => {
          this.setState({ notesInputVisible: true, newNotesItemType: 'regular' });
        }, 100);
      } else if (key === 'Shift') {
        setTimeout(() => {
          this.setState({ commandStarted: true });
        }, 100);
        console.log('command started');
      }
    }
  }

  addNewNotesItem() {
    const text = this.state.notesText.trim();
    if (!text) {
      this.resetNewNotes();
      return;
    }

    const newNotes = {
      notesType: this.state.newNotesItemType,
      notesText: this.state.notesText,
    };
    this.setState({
      notesText: '',
      notesInputVisible: false,
      newNotesItemType: '',
    });

    this.props.addNotesItem(newNotes);
  }

  resetNewNotes() {
    this.setState({
      notesText: '',
      notesInputVisible: false,
      newNotesItemType: '',
    });
  }

  renderNewNotesItem() {
    const { newNotesItemType, notesText } = this.state;
    if (!newNotesItemType) return null;

    return getNotesTypeComponent(newNotesItemType, notesText);
  }

  resolveCommand(command) {
    const trimmedCommand = command.trim();
    if (validCommands[trimmedCommand]) {
      console.log('valid command: ', trimmedCommand);
      setTimeout(() => {
        this.setState({ notesInputVisible: true, newNotesItemType: trimmedCommand });
      }, 50);
    } else if (trimmedCommand === '') {
      setTimeout(() => {
        this.setState({ notesInputVisible: true, newNotesItemType: 'regular' });
      }, 50);
    } else {
      console.log('invalid command: ', trimmedCommand);
    }
  }

  render() {
    const {
      commandStarted,
      commandText,
      notesInputVisible,
      notesText,
    } = this.state;

    const { notesList } = this.props;

    return (
      <div className='note-document'>
        {
          notesList.map((notesItem, key) => {
            const { notesType, notesText } = notesItem;
            return getNotesTypeComponent(notesType, notesText, key);
          })
        }
        {
          this.renderNewNotesItem()
        }
        {
          commandStarted ? (
            <CommandList
              commandText={commandText}
              onSubmitCommand={this.onSubmitCommand}
              onChangeCommand={this.onChangeCommand} />
          ) : null
        }
        {
          notesInputVisible ? (
            <NoteInput
              value={notesText}
              onChange={this.onChangeNotesInput} />
          ) : null
        }

        <div className='document-instructions'>
          PRESS <span className='note-worthy-text'>'ENTER'</span> TO START
          TYPING NOTES <span className='emphasized-text'>OR</span> <span className='note-worthy-text'>'SHIFT'</span> TO
          SELECT A FORMAT
        </div>
      </div>
    );
  }
}

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
        onChange={this.onChange}
        value={value}
        ref={(textarea) => { this.textarea = textarea; } } />
    );
  }
}
