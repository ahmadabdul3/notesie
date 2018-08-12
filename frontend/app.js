import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import reducer from './redux';

// - redux and react router stuff
import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import {
  connectRouter, routerMiddleware, ConnectedRouter
} from 'connected-react-router';
import thunk from 'redux-thunk';

import Navigation from 'src/frontend/components/navigation';
import AppBodyContainer from 'src/frontend/containers/app_body_container';
import { Route } from 'react-router-dom';

const history = createBrowserHistory();
const store = createStore(
  connectRouter(history)(reducer), // new root reducer with router state
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
          <AppComponent />
        </ConnectedRouter>
      </Provider>
    );
  }
}

function AppComponent() {
  return (
    <div className='app-layout'>
      <Navigation />
      <Route component={AppBodyContainer} />
    </div>
  );
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
// - cloning documents
// - cloning notes
// - add before / after
// - clone notes from 1 doc to another
// - * select note items *** done
// - * multi-select note items by clicking 'shift' *** done
