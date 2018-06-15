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

  render() {
    const { labelText, type, name, value, message, isWhite } = this.props;
    const { active } = this.state;
    const classBase = isWhite ? 'form-input-white' : 'form-input';
    let klass = classBase;
    if (active) klass = classBase + '-active';

    return (
      <div className={klass}>
        <div className='form-input__label-input-wrapper'>
          <label className='form-input__label' onClick={this.focusInput}>
            { labelText }
          </label>
          <input
            ref={(input) => { this.inputRef = input; }}
            name={name}
            value={value}
            type={type}
            className='form-input__input'
            onFocus={this.setToActive}
            onBlur={this.setToInactive}
            onChange={this.onChange} />
          <div className='form-input__input-border' />
        </div>
        <footer className='form-input__message'>
           { message }
        </footer>
      </div>
    );
  }
}
