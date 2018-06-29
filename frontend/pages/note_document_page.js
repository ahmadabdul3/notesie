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

  goBack = () => {
    this.props.history.goBack();
  }

  render() {
    return (
      <div className='note-document-page'>
        <nav className='note-document-page__nav'>
          <div className='page-width'>
            <button className='red-button' onClick={this.goBack}>
              {`< back`}
            </button>
          </div>
        </nav>
        <NoteDocumentContainer />
      </div>
    );
  }
}
