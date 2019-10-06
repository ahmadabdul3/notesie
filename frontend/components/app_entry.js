import React, { Component } from 'react';
import NavigationContainer from 'src/frontend/containers/navigation_container';
// import NotificationsContainer from 'src/frontend/containers/notifications_container';
import AppBodyContainer from 'src/frontend/containers/app_body_container';
import { Route } from 'react-router-dom';
import { getUser } from 'src/frontend/clients/data_api/users_client';

export default class AppEntry extends Component {
  componentDidMount() {
    const token = localStorage.getItem('notesie-access-token');
    if (!token) return;
    this.fetchUser();
  }

  fetchUser = () => {
    getUser().then(getUserRes => {
      this.props.fetchUserOnInitSuccess({ user: getUserRes.user });
    }).catch(e => {
      console.log('error', e);
    });
  };

  render() {
    return (
      <div className='app-layout'>
        <NavigationContainer />
        {
          // <NotificationsContainer />
        }
        <Route component={AppBodyContainer} />
      </div>
    );
  }
}
