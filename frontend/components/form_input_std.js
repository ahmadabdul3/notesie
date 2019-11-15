import React, { PureComponent } from 'react';

export default class FormInputStd extends PureComponent {
  inputRef = null;

  componentDidMount() {
    if (this.props.autoFocus) this.focusInput();
  }

  focusInput = () => {
    this.inputRef.focus();
  }

  onChange = (e) => {
    const { name, onChange } = this.props;
    const { value } = e.target;

    onChange({ name, value }, e);
  }

  render() {
    const { labelText, type, name, value, message, hasError } = this.props;
    let klass = 'form-input-std';
    if (hasError) klass += ' error';

    return (
      <div className={klass}>
        <label className='input__label' onClick={this.focusInput}>
          { labelText }
        </label>
        <input
          ref={(input) => { this.inputRef = input; }}
          name={name}
          value={value}
          type={type}
          className='input'
          onChange={this.onChange} />
        <footer className='input__message'>
           { message }
        </footer>
      </div>
    );
  }
}
