import React from 'react';
import { AppRegistry } from 'react-native';

import App from './src/App';

const RNRoot = props => (
  <App { ...props } platform="iOS" />
);

// Module name
AppRegistry.registerComponent('RNRoot', () => RNRoot);
