import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import HomePageContainer from 'src/frontend/containers/home_page_container';
import NotebookPage from 'src/frontend/pages/notebook_page';
import appRoutes from 'src/constants/routes';

export default class AppBody extends Component {
  render() {
    return (
      <div className='app-body'>
        <Route exact path={appRoutes.home} component={HomePageContainer} />
        <Route path={appRoutes.notebookWithId} component={NotebookPage} />
      </div>
    );
  }
}
