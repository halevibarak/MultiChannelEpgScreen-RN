import { combineReducers } from 'redux';

import app from './app';
import settings from './settings';
import channels from './channels';

const rootReducer = combineReducers({
  app,
  settings,
  channels
});

export default rootReducer;
