/* global require */
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';

import rootReducer from '../reducers';
import getMiddlewares from '../middlewares';

export default (initialState, env) => {
  const middlewaresComposer = env !== 'production' ? composeWithDevTools : compose;
  return createStore(rootReducer, initialState, middlewaresComposer(
    applyMiddleware(...getMiddlewares(env)),
  ));
};
