import { combineReducers } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import placeholder from './placeholder';
import thunk from 'redux-thunk';

const reducer = combineReducers({
  placeholder,
});

const store = createStore(reducer, {}, applyMiddleware(thunk));
export default store;
