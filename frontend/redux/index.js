import { combineReducers } from 'redux';
import placeholder from './placeholder';
import notes from './notes';
import notesDocuments from './notes_documents';

const reducer = combineReducers({
  placeholder,
  notes,
  notesDocuments,
});

export default reducer;
