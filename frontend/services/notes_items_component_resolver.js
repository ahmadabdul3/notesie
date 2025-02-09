import React from 'react';
import NotesItemContainer from 'src/frontend/containers/notes_item_container';
import { TransientNotesItem } from 'src/frontend/components/notes_item';
import {
  NotesItemRegular,
  NotesItemBullet1,
  NotesItemBullet2,
  NotesItemBullet3,
  NotesItemQuote,
} from 'src/frontend/components/notes_item_types.js';

export function getPermanentNotesTypeComponent(props) {
  const { formatting, noteText } = props.noteItem;
  const allProps = {
    ...props,
    formattedNoteTextComponent: getNotesItem(formatting, { noteText, isTransient: false }),
  };

  return <NotesItemContainer { ...allProps } />
}

// - this is currently used to render the notes item that is reflective
//   of what the user is typing, this version doesn't have a delete/edit
//   and other interaction features/buttons
export function getTransientNotesTypeComponent(props) {
  const { formatting, noteText } = props.noteItem;
  const allProps = {
    ...props,
    isTransient: true,
    formattedNoteTextComponent: getNotesItem(formatting, { noteText, isTransient: true }),
  };

  return <TransientNotesItem { ...allProps } />;
}

function getNotesItem(formatting, props) {
  switch (formatting) {
    case 'regular':
      return <NotesItemRegular {...props} />;
    case '-':
      return <NotesItemBullet1 {...props} />;
    case '-2':
      return <NotesItemBullet2 {...props} />;
    case '-3':
      return <NotesItemBullet3 {...props} />;
    case '"':
      return <NotesItemQuote {...props} />;
  }
}
