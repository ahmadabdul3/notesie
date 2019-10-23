import React, { PureComponent } from 'react';

export class NotesItemRegular extends PureComponent {
  render() {
    return (
      <div className='notes-item__regular'>
        <NoteText {...this.props} />
      </div>
    );
  }
}

export class NotesItemBullet1 extends PureComponent {
  render() {
    return (
      <div className='notes-item__bullet-1'>
        <NoteText {...this.props} />
      </div>
    );
  }
}

export class NotesItemBullet2 extends PureComponent {
  render() {
    return (
      <div className='notes-item__bullet-2'>
        <NoteText {...this.props} />
      </div>
    );
  }
}

export class NotesItemBullet3 extends PureComponent {
  render() {
    return (
      <div className='notes-item__bullet-3'>
        <NoteText {...this.props} />
      </div>
    );
  }
}

export class NotesItemQuote extends PureComponent {
  render() {
    return (
      <div className='notes-item__quote'>
        <NoteText {...this.props} />
      </div>
    );
  }
}

class NoteText extends PureComponent {
  get justText() {
    const { noteText } = this.props;
    return <div> { noteText || 'Start typing your notes...' } </div>;
  }

  get transientText() {
    // thinking about whether I should keep the blinking indicator or not
    // let text = this.props.noteText;
    // if (!text) {
    //   text = `This is how your notes will appear, \
    //   start typing to add your own`;
    //   return (
    //     <div>
    //       <span className='notes-item__cursor' />
    //       { text }
    //     </div>
    //   )
    // }
    //
    // return (
    //   <div>
    //     { text }
    //     <span className='notes-item__cursor' />
    //   </div>
    // );
    const { noteText } = this.props;
    if (noteText) return this.justText;
    return (
      <div>
        This is how your notes will appear, start typing to add your own
      </div>
    );
  }

  render() {
    const { isTransient } = this.props;
    if (isTransient) return this.transientText;
    return this.justText;
  }
}
