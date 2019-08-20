import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import configureStore from './store';

import { Main } from './components';

import * as Dates from './helpers/dates'

class App extends Component {
  constructor(props) {
    super(props);
    // Dates.setLocale(props.settings.APCurrentLanguage);
  }

  componentWillMount() {
    const { platform = 'android', BundleIdentifier } = this.props; // eslint-disable-line no-unused-vars

    let settings = this.props.settings && JSON.parse(this.props.settings);

    const store = configureStore({
      settings: {
        ...settings,
        BundleIdentifier,
        Store: platform.toLowerCase(),
      },
    }, process.env.NODE_ENV);
   
		console.disableYellowBox = true;

    let extra_props = this.props['extra_props'] && JSON.parse(this.props['extra_props']);
    global.zappConfig = extra_props['uibuilder_screen_model']['styles'];
    
    this.store = store;
  }
  
  render() {
    return (
      <Provider store={this.store}>
        <Main />
      </Provider>
    );
  }
}

App.propTypes = {
  settings: PropTypes.object,
  BundleIdentifier: PropTypes.string,
  urlScheme: PropTypes.string
};

export default App;
