import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import placeholder from './placeholder';
import notes from './notes';
import notebooks from './notebooks';

function createAppReducer(history) {
  // - combineReducers returns a function that gets executed by redux
  //   every time an event is dispatched, it looks like this:
  //
  //   return function(state, action) { ... };
  //
  return combineReducers({
    router: connectRouter(history),
    placeholder,
    notes,
    notebooks,
  });
}

export default function createRootReducer(history) {
  // - here we store the function returned by combine reducers, and then
  //   we execute it below
  const appReducer = createAppReducer(history);

  // - this function is a wrapper, it takes the state and actions that are
  //   generally passed to the function created by combineReducers,
  //   and does a check on the action type, then below it executes the
  //   actual function returned by combineReducers and passes the state
  //   and action down to it
  return function(state, action) {
    if (action.type === 'LOGOUT_SUCCESS') state = undefined;
    return appReducer(state, action);
  }
}
