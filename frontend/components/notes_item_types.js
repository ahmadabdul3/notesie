import React, { PureComponent } from 'react';

export class NotesItemRegular extends PureComponent {
  render() {
    return (
      <div className='notes-item__regular'>
        <NotesText {...this.props} />
      </div>
    );
  }
}

export class NotesItemBullet1 extends PureComponent {
  render() {
    return (
      <div className='notes-item__bullet-1'>
        <NotesText {...this.props} />
      </div>
    );
  }
}

export class NotesItemBullet2 extends PureComponent {
  render() {
    return (
      <div className='notes-item__bullet-2'>
        <NotesText {...this.props} />
      </div>
    );
  }
}

export class NotesItemBullet3 extends PureComponent {
  render() {
    return (
      <div className='notes-item__bullet-3'>
        <NotesText {...this.props} />
      </div>
    );
  }
}

export class NotesItemQuote extends PureComponent {
  render() {
    return (
      <div className='notes-item__quote'>
        <NotesText {...this.props} />
      </div>
    );
  }
}

class NotesText extends PureComponent {
  get justText() {
    const { notesText } = this.props;
    return <div> { notesText || 'Start typing your notes...' } </div>;
  }

  get transientText() {
    // thinking about whether I should keep the blinking indicator or not
    // let text = this.props.notesText;
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
    const { notesText } = this.props;
    if (notesText) return this.justText;
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
