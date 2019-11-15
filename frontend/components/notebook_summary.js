import React from 'react';

export default function NotebookSummary({ data, click, notesList }) {
  const { name } = data;
  const noNotesYet = "This notebook doesn't have any notes yet";
  let summary = '';

  if (notesList.length > 0) {
    summary = notesList.map((noteItem, key) => {
      return <div key={key}> { noteItem.noteText } </div>;
    });
  }

  return (
    <div className='notebook' onClick={click}>
      <div className='overflow-fade' />
      <header className='notebook__header'>
        { name }
      </header>
      <article className='notebook__summary'>
        { summary || noNotesYet }
      </article>
    </div>
  );
}
