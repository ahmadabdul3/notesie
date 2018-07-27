import React from 'react';
import NotesItemContainer from 'src/frontend/containers/notes_item_container';
import { TransientNotesItem } from 'src/frontend/components/notes_item';

export function getPermanentNotesTypeComponent({
  type, text, key, documentId, saveEdits, selected, deleted,
}) {
  return getNotesTypeComponent({
    type, text, key, documentId, saveEdits, selected, deleted,
    NotesItemWrapper: NotesItemContainer
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
  type, text, key, documentId, saveEdits, NotesItemWrapper, selected, deleted,
}) {
  const allProps = {
    type, text, key, documentId, saveEdits, selected, deleted, index: key,
  };

  switch (type) {
    case 'regular':
      allProps.notesItem = (
        <div className='notes-item__regular'>
          { text }
        </div>
      );
      break;
    case '-':
      allProps.notesItem = (
        <div className='notes-item__bullet-1'>
          { text }
        </div>
      );
      break;
    case '-2':
      allProps.notesItem = (
        <div className='notes-item__bullet-2'>
          { text }
        </div>
      );
      break;
    case '-3':
      allProps.notesItem = (
        <div className='notes-item__bullet-3'>
          { text }
        </div>
      );
      break;
    case '"':
      allProps.notesItem = (
        <div className='notes-item__quote'>
          { text }
        </div>
      );
      break;
  }

  return <NotesItemWrapper { ...allProps } />;
}
