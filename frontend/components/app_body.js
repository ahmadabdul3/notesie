import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import HomePageContainer from 'src/frontend/containers/home_page_container';
import NoteDocumentPage from 'src/frontend/pages/note_document_page';
import appRoutes from 'src/constants/routes';

export default class AppBody extends Component {
  render() {
    return (
      <div className='app-body'>
        <Route exact path={appRoutes.home} component={HomePageContainer} />
        <Route path={appRoutes.noteDocWithId} component={NoteDocumentPage} />
      </div>
    );
  }
}
