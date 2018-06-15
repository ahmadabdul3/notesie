import React, { Component } from 'react';

export default class FormInput extends Component {
  state = {
    active: false,
  };

  inputRef = null;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.autoFocus) this.focusInput();
    else {
      setTimeout(() => {
        if (this.inputRef.value) {
          this.setState({ active: true });
        }
      }, 200);
    }
  }

  setToActive = () => {
    this.setState({ active: true });
  }

  setToInactive = (e) => {
    if (!e.target.value) this.setState({ active: false });
  }

  focusInput = () => {
    this.inputRef.focus();
  }

  onChange = (e) => {
    const { name, onChange } = this.props;
    const { value } = e.target;

    onChange(name, value);
  }

  renderOptions() {
    const { options } = this.props;

    return options.map((option, key) => {
      return (
        <option value={option.value} key={key}>
          { option.text }
        </option>
      );
    });
  }

  render() {
    const { labelText, name, value, message, options  } = this.props;
    const { active } = this.state;

    return (
      <div className='form-select'>
        <label className='form-select__label' onClick={this.focusInput}>
          { labelText }
        </label>
        <select
          ref={(input) => { this.inputRef = input; }}
          name={name}
          value={value}
          className='form-select__select'
          onChange={this.onChange}>
          { this.renderOptions() }
        </select>
        <footer className='form-select__message'>
           { message }
        </footer>
      </div>
    );
  }
}
