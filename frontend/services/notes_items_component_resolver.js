import React from 'react';
import NotesItemContainer from 'src/frontend/containers/notes_item_container';

export default function getNotesTypeComponent({ type, text, key, documentId }) {
  if (type === 'regular') {
    return (
      <NotesItemContainer key={key} index={key} documentId={documentId}>
        <div className='notes-item__regular'>
          { text }
        </div>
      </NotesItemContainer>
    );
  }
  if (type === '-') {
    return (
      <NotesItemContainer key={key} index={key} documentId={documentId}>
        <div className='notes-item__bullet-1'>
          { text }
        </div>
      </NotesItemContainer>
    );
  }
  if (type === '-2') {
    return (
      <NotesItemContainer key={key} index={key} documentId={documentId}>
        <div className='notes-item__bullet-2'>
          { text }
        </div>
      </NotesItemContainer>
    );
  }
  if (type === '-3') {
    return (
      <NotesItemContainer key={key} index={key} documentId={documentId}>
        <div className='notes-item__bullet-3'>
          { text }
        </div>
      </NotesItemContainer>
    );
  }
  if (type === '"') {
    return (
      <NotesItemContainer key={key} index={key} documentId={documentId}>
        <div className='notes-item__quote'>
          { text }
        </div>
      </NotesItemContainer>
    );
  }
}
