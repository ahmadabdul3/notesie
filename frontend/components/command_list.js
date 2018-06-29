import React, { Component } from 'react';
import validCommands from 'src/constants/valid_commands';
import { getNotesTypeExample } from 'src/frontend/components/notes_type_example';

export default class CommandList extends Component {
  commandInput = null;
  nameText = null;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.commandInput.focus();
  }

  get randomNameText() {
    if (this.nameText) return this.nameText;
    const date = new Date();
    this.nameText = date.toString();
    return this.nameText;
  }

  filterCommands() {
    const { commandText } = this.props;
    return Object.keys(validCommands).filter((command) => {
      return command.indexOf(commandText) > -1;
    });
  }

  // - this is here because the parent function shouldn't need to know
  //   about 'preventDefault', it should just handle logic
  onSubmitCommand = (e) => {
    e.preventDefault();
    this.props.onSubmitCommand();
  }

  onChangeCommand = (e) => {
    this.props.onChangeCommand(e.target.value);
  }

  render() {
    const {
      commandText
    } = this.props;

    const filteredCommands = this.filterCommands();

    return (
      <div className='command-list-container'>
        <div className='command-list__background-overlay' />
        <div className='command-list'>
          <header className='command-list__header'>
            <div className='command-list-header__label'>
              AVAILABLE FORMATS - PRESS <span className='note-worthy-text'>'ENTER'</span> WHEN
              FINISHED <span className='emphasized-text'>OR</span> <span className='note-worthy-text'>'ESC'</span> TO CANCEL
            </div>
            <form className='command-list-header__form' onSubmit={this.onSubmitCommand}>
              <input
                type='text'
                className='command-list-header__command-input'
                placeholder="Enter a format, like '-2'"
                onChange={this.onChangeCommand}
                value={commandText}
                name={`command-text ${this.randomNameText}`}
                ref={(input) => { this.commandInput = input; }}  />
            </form>
          </header>
          <div className='command-list__items'>
            {
              filteredCommands.length > 0 ? filteredCommands.map((command, i) => {
                let classname = 'command-list__item';
                if (command === commandText) classname = 'command-list__item__highlighted';
                return (
                  <div key={i} className={classname}>
                    <div className='command-list__item__command-text'>
                      { command }
                    </div>
                    { getNotesTypeExample(command) }
                  </div>
                )
              }) : <div className='command-list__item'>No format found</div>
            }
          </div>
        </div>
      </div>
    );
  }
}
