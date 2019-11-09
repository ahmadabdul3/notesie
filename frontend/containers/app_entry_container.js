import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import AppEntry from 'src/frontend/components/app_entry';
import { actions } from 'src/frontend/redux/session';
import { actions as modalActions } from 'src/frontend/redux/modals';

export function mapStateToProps() {
  return {
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    fetchUserOnInitSuccess: (data) => dispatch(actions.fetchUserOnInitSuccess(data)),
    clearUserSession: () => dispatch(actions.logoutSuccess()),
    openModal: (data) => dispatch(modalActions.openModal(data)),
    closeModal: () => dispatch(modalActions.closeModal()),
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppEntry);

export default () => (<Route render={(props) => (<Container {...props} />)} />);
