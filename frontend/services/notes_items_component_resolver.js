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

export function getPermanentNotesTypeComponent({
  notesType,
  notesText,
  key,
  documentId,
  saveEdits,
  selected,
  deleted,
}) {
  return getNotesTypeComponent({
    notesType,
    notesText,
    key,
    documentId,
    saveEdits,
    selected,
    deleted,
    NotesItemWrapper: NotesItemContainer
  });
}

// - this is currently used to render the notes item that is reflective
//   of what the user is typing, this version doesn't have a delete/edit
//   and other interaction features/buttons
export function getTransientNotesTypeComponent({
  notesType,
  notesText,
  key,
  documentId,
  saveEdits
}) {
  return getNotesTypeComponent({
    notesType,
    notesText,
    key,
    documentId,
    saveEdits,
    NotesItemWrapper: TransientNotesItem,
    isTransient: true,
  });
}

function getNotesTypeComponent({
  notesType,
  notesText,
  key,
  documentId,
  saveEdits,
  NotesItemWrapper,
  selected,
  deleted,
  isTransient,
}) {
  const allProps = {
    notesType,
    notesText,
    key,
    documentId,
    saveEdits,
    selected,
    deleted,
    index: key,
    notesItem: getNotesItem(notesType, { notesText, isTransient }),
  };

  return <NotesItemWrapper { ...allProps } />;
}

function getNotesItem(type, props) {
  switch (type) {
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
