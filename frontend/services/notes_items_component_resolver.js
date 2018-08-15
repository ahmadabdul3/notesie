import React from 'react';
import NotesItemContainer from 'src/frontend/containers/notes_item_container';
import { TransientNotesItem } from 'src/frontend/components/notes_item';

export function getPermanentNotesTypeComponent({
  notesType, notesText, key, documentId, saveEdits, selected, deleted,
}) {
  return getNotesTypeComponent({
    notesType, notesText, key, documentId, saveEdits, selected, deleted,
    NotesItemWrapper: NotesItemContainer
  });
}

// - this is currently used to render the notes item that is reflective
//   of what the user is typing, this version doesn't have a delete/edit
//   and other interaction features/buttons
export function getTransientNotesTypeComponent({
  notesType, notesText, key, documentId, saveEdits
}) {
  return getNotesTypeComponent({
    notesType, notesText, key, documentId, saveEdits, NotesItemWrapper: TransientNotesItem
  });
}

function getNotesTypeComponent({
  notesType, notesText, key, documentId, saveEdits, NotesItemWrapper, selected, deleted,
}) {
  const allProps = {
    notesType, notesText, key, documentId, saveEdits, selected, deleted, index: key,
  };

  switch (notesType) {
    case 'regular':
      allProps.notesItem = (
        <div className='notes-item__regular'>
          { notesText }
        </div>
      );
      break;
    case '-':
      allProps.notesItem = (
        <div className='notes-item__bullet-1'>
          { notesText }
        </div>
      );
      break;
    case '-2':
      allProps.notesItem = (
        <div className='notes-item__bullet-2'>
          { notesText }
        </div>
      );
      break;
    case '-3':
      allProps.notesItem = (
        <div className='notes-item__bullet-3'>
          { notesText }
        </div>
      );
      break;
    case '"':
      allProps.notesItem = (
        <div className='notes-item__quote'>
          { notesText }
        </div>
      );
      break;
  }

  return <NotesItemWrapper { ...allProps } />;
}
