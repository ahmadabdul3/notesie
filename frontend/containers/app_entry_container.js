import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import AppEntry from 'src/frontend/components/app_entry';
import { actions } from 'src/frontend/redux/session';

export function mapStateToProps() {
  return { };
}

export function mapDispatchToProps(dispatch) {
  return {
    fetchUserOnInitSuccess: (data) => dispatch(actions.fetchUserOnInitSuccess(data)),
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppEntry);

export default () => (<Route render={(props) => (<Container {...props} />)} />);
