import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux';
import { BrowserRouter } from 'react-router-dom';
import Navigation from 'src/frontend/components/navigation';
import AppBody from 'src/frontend/containers/app_body_container';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <AppComponent />
        </BrowserRouter>
      </Provider>
    );
  }
}

function AppComponent() {
  return (
    <div className='app'>
      <Navigation />
      <AppBody />
    </div>
  );
}

if (typeof window !== 'undefined') {
  ReactDom.render(
    <App />, document.getElementById('entry-point')
  );
}
