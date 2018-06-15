import React from 'react';

export function getNotesTypeExample(command) {
  if (command === '-') {
    return (
      <NotesTypeExampleBulletOne />
    );
  }
  if (command === '-2') {
    return (
      <NotesTypeExampleBulletTwo />
    );
  }
  if (command === '-3') {
    return (
      <NotesTypeExampleBulletThree />
    );
  }
  if (command === '"') {
    return (
      <NotesTypeExampleQuote />
    );
  }
}

function NotesTypeExampleQuote() {
  return (
    <NotesTypeExample>
      <NotesExampleLineQuote />
    </NotesTypeExample>
  );
}

function NotesTypeExampleBulletOne() {
  return (
    <NotesTypeExample>
      <NotesExampleLineBulletOne />
    </NotesTypeExample>
  );
}

function NotesTypeExampleBulletTwo() {
  return (
    <NotesTypeExample>
      <NotesExampleLineBulletTwo />
    </NotesTypeExample>
  );
}

function NotesTypeExampleBulletThree() {
  return (
    <NotesTypeExample>
      <NotesExampleLineBulletThree />
    </NotesTypeExample>
  );
}

function NotesTypeExample({ children }) {
  return (
    <div className='notes-type-example'>
      <div className='notes-example-line' />
      <div className='notes-example-line' />
        { children }
      <div className='notes-example-line' />
    </div>
  );
}

function NotesExampleLineQuote() {
  return (
    <div className='notes-example-line__quote'>
      <div className='note-line' />
      <div className='note-line' />
    </div>
  );
}

function NotesExampleLineBulletOne() {
  return (
    <div className='notes-example-line__bullet-one'>
      <div className='note-line' />
      <div className='note-line' />
    </div>
  );
}

function NotesExampleLineBulletTwo() {
  return (
    <div className='notes-example-line__bullet-two'>
      <div className='note-line' />
      <div className='note-line' />
    </div>
  );
}

function NotesExampleLineBulletThree() {
  return (
    <div className='notes-example-line__bullet-three'>
      <div className='note-line' />
      <div className='note-line' />
    </div>
  );
}
