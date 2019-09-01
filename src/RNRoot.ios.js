import React from 'react';

import App from './App';

const RNRoot = props => (
  <App { ...props } platform="iOS" />
);

export default RNRoot;
