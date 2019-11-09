import React from 'react';
import { connect } from 'react-redux';
import Modals from 'src/frontend/components/modals';
import { actions as modalActions } from 'src/frontend/redux/modals';

export function mapStateToProps({ modals }) {
  return {
    modalName: modals.openModalName,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    openModal: (data) => dispatch(modalActions.openModal(data)),
    closeModal: () => dispatch(modalActions.closeModal()),
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Modals);

export default Container;
