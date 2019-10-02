import React from 'react';

export default function NotebookSummary({ data, click, notesList }) {
  const { name } = data;
  const noNotesYet = "This notebook doesn't have any notes yet";
  let summary = '';

  if (notesList.length > 0) {
    summary = notesList.map((notesItem, key) => {
      return <div key={key}> { notesItem.notesText } </div>;
    });
  }

  return (
    <div className='note-doc' onClick={click}>
      <div className='overflow-fade' />
      <header className='note-doc__header'>
        { name }
      </header>
      <article className='note-doc__summary'>
        { summary || noNotesYet }
      </article>
    </div>
  );
}
