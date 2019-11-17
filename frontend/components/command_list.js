import React, { Component } from 'react';
import validCommands from 'src/constants/valid_commands';
import { getNotesTypeExample } from 'src/frontend/components/notes_type_example';
import Modal from 'src/frontend/components/modal';

export default class CommandList extends Component {
  commandInput = null;
  nameText = null;

  state = {
    commandText: '',
  };

  componentDidMount() {
    if (this.commandInput) this.commandInput.focus();
  }

  componentDidUpdate() {
    if (this.props.visible) this.commandInput.focus();
  }

  // - this allows the input to not autofill, because it randomizes
  //   the 'name' attribute of the input
  get randomNameText() {
    if (this.nameText) return this.nameText;
    const date = new Date();
    this.nameText = date.toString();
    return this.nameText;
  }

  filterCommands() {
    const { commandText } = this.state;
    return Object.keys(validCommands).filter((command) => {
      return command.indexOf(commandText) > -1;
    });
  }

  onSubmitCommand = (e) => {
    e.preventDefault();
    const command = this.state.commandText.trim();

    if (!validCommands[command]) {
      // - this should render an error message in the future
      //   like 'invalid command'
      this.props.hideCommandList();
      return;
    }

    this.sendCommandToParent(command);
  }

  selectCommandItem = (command) => {
    this.sendCommandToParent(command);
  }

  sendCommandToParent(command) {
    this.props.onSubmitCommand(command);
    this.setState({ commandText: '' });
  }

  onChangeCommand = (e) => {
    const { value } = e.target;
    this.setState({ commandText: value });
  }

  render() {
    const { hideCommandList, visible } = this.props;
    const { commandText } = this.state;

    const filteredCommands = this.filterCommands();

    return (
      <Modal open={visible} onClose={hideCommandList} customClass='command-list-modal'>
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
                  <div
                    key={i}
                    className={classname}
                    onClick={() => this.selectCommandItem(command)}>
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
      </Modal>
    );
  }
}
