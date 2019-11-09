export const notesItemStatus = {
  // - this is a transient status that changes once the notes are saved
  // - probably need some permanent statuses like 'inserted_before' or
  //   something, maybe that's not a status, but 'insertionMethod'
  insertedUnsaved: 'inserted_unsaved',
  insertedBefore: 'inserted_before',
  insertedAfter: 'inserted_after',
};

const SEPARATOR__STATUS = '::';

export function addStatuses({ itemStatus, newStatuses }) {
  if (!itemStatus) return newStatuses.join(SEPARATOR__STATUS);

  const itemStatuses = itemStatusNormalized.split(SEPARATOR__STATUS);
  return [ ...itemStatuses, ...newStatuses ].join(SEPARATOR__STATUS);
}

export function isItemInsertedBefore({ item }) {
  return itemHasStatus({ item, status: notesItemStatus.insertedBefore});
}

export function isItemInsertedAfter({ item }) {
  return itemHasStatus({ item, status: notesItemStatus.insertedAfter });
}

export function isItemInsertedUnsaved({ item }) {
  return itemHasStatus({ item, status: notesItemStatus.insertedUnsaved });
}

function itemHasStatus({ item, status }) {
  if (!item.status) return;
  const statuses = item.status.split(SEPARATOR__STATUS);
  // - we shouldn't ever have more than a few statuses
  //   so this .find isnt a performance issue right now
  return statuses.find(s => s === status);
}
