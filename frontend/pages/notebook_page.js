import React, { Component } from 'react';
import appRoutes from 'src/constants/routes';
import { NavLink } from 'react-router-dom';
import NotebookContainer from 'src/frontend/containers/notebook_container';

export default class NotebookPage extends Component {
  state = {
    loading: false,
  }

  render() {
    return (
      <div className='note-document-page'>
        <NotebookContainer routerProps={this.props} />
      </div>
    );
  }
}
