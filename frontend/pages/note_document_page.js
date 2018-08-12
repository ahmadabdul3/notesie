import React, { Component } from 'react';
import appRoutes from 'src/constants/routes';
import { NavLink } from 'react-router-dom';
import NoteDocumentContainer from 'src/frontend/containers/note_document_container';

export default class NoteDocumentPage extends Component {
  state = {
    loading: false,
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='note-document-page'>
        <NoteDocumentContainer routerProps={this.props} />
      </div>
    );
  }
}
