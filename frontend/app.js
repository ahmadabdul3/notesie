import "core-js/stable";
import "regenerator-runtime/runtime";

import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import createRootReducer from './redux';

// - redux and react router stuff
import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import {routerMiddleware, ConnectedRouter } from 'connected-react-router';
import thunk from 'redux-thunk';

import Navigation from 'src/frontend/components/navigation';
import AppEntryContainer from 'src/frontend/containers/app_entry_container';
import { Route } from 'react-router-dom';

const history = createBrowserHistory();
const store = createStore(
  createRootReducer(history), // new root reducer with router state
  {}, // initial state
  compose(
    applyMiddleware(
      routerMiddleware(history), // for dispatching history actions
      thunk,
    ),
  ),
);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <AppEntryContainer />
        </ConnectedRouter>
      </Provider>
    );
  }
}

if (typeof window !== 'undefined') {
  ReactDom.render(
    <App />, document.getElementById('entry-point')
  );
}


// features
// - unit tests
// - authentication
// - more formatting - title, subtitle, columns
// - note comments
// - batch update
// - backend
// - cloning notebooks
// - cloning notes
// - collapse groups of notes
// - group notes together with a title
// - *** add before / after *** done
// - clone notes from 1 doc to another
// - *** select note items *** done
// - *** multi-select note items by clicking 'shift' *** done
