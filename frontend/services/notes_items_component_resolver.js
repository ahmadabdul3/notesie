import React from 'react';
import NotesItemContainer from 'src/frontend/containers/notes_item_container';
import { TransientNotesItem } from 'src/frontend/components/notes_item';

export function getPermanentNotesTypeComponent({
  type, text, key, documentId, saveEdits
}) {
  return getNotesTypeComponent({
    type, text, key, documentId, saveEdits, NotesItemWrapper: NotesItemContainer
  });
}

// - this is currently used to render the notes item that is reflective
//   of what the user is typing, this version doesn't have a delete/edit
//   and other interaction features/buttons
export function getTransientNotesTypeComponent({
  type, text, key, documentId, saveEdits
}) {
  return getNotesTypeComponent({
    type, text, key, documentId, saveEdits, NotesItemWrapper: TransientNotesItem
  });
}

function getNotesTypeComponent({
  type, text, key, documentId, saveEdits, NotesItemWrapper
}) {
  switch (type) {
    case 'regular':
      return (
        <NotesItemWrapper
          key={key}
          index={key}
          documentId={documentId}
          saveEdits={saveEdits}
          notesItem={(
            <div className='notes-item__regular'>
              { text }
            </div>
          )} />
      );
    case '-':
      return (
        <NotesItemWrapper
          key={key}
          index={key}
          documentId={documentId}
          saveEdits={saveEdits}
          notesItem={(
            <div className='notes-item__bullet-1'>
              { text }
            </div>
          )} />
      );
    case '-2':
      return (
        <NotesItemWrapper
          key={key}
          index={key}
          documentId={documentId}
          saveEdits={saveEdits}
          notesItem={(
            <div className='notes-item__bullet-2'>
              { text }
            </div>
          )} />
      );
    case '-3':
      return (
        <NotesItemWrapper
          key={key}
          index={key}
          documentId={documentId}
          saveEdits={saveEdits}
          notesItem={(
            <div className='notes-item__bullet-3'>
              { text }
            </div>
          )} />
      );
    case '"':
      return (
        <NotesItemWrapper
          key={key}
          index={key}
          documentId={documentId}
          saveEdits={saveEdits}
          notesItem={(
            <div className='notes-item__quote'>
              { text }
            </div>
          )} />
      );
  }
}
