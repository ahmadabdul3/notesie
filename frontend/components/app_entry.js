import React, { Component } from 'react';
import NavigationContainer from 'src/frontend/containers/navigation_container';
// import NotificationsContainer from 'src/frontend/containers/notifications_container';
import AppBodyContainer from 'src/frontend/containers/app_body_container';
import { Route } from 'react-router-dom';
import { getUser } from 'src/frontend/clients/data_api/users_client';
import {
  userIsAuthenticated,
  clearAccessToken,
} from 'src/frontend/services/authentication';
import ModalsContainer from 'src/frontend/containers/modals_container';
import {
  MODAL_NAME__LOGIN,
} from 'src/frontend/constants/modal_names_constants';

export default class AppEntry extends Component {
  componentDidMount() {
    if (!userIsAuthenticated()) this.props.openModal({ modalName: MODAL_NAME__LOGIN });
    this.fetchUser();
  }

  fetchUser = () => {
    getUser().then(getUserRes => {
      this.props.fetchUserOnInitSuccess({ user: getUserRes.user });
    }).catch(e => {
      if (e.message === 'Forbidden') {
        clearAccessToken();
        this.props.clearUserSession();
        this.props.openModal({ modalName: MODAL_NAME__LOGIN });
      }
      console.log('error', e);
    });
  };

  render() {
    return (
      <div className='app-layout'>
        <NavigationContainer />
        <ModalsContainer />
        {
          // <NotificationsContainer />
        }
        <Route component={AppBodyContainer} />
      </div>
    );
  }
}
