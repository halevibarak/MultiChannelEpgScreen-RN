import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import configureStore from './store';
import { loadChannels } from './actions/channels';

import { Main } from './components';

import dates from './helpers/dates'

class App extends Component {
  constructor(props) {
    super(props);
    // dates.setLocale(props.settings.APCurrentLanguage);
  }

  componentWillMount() {
    const { BundleIdentifier, platform = "android" } = this.props;

    let settings = this.props.settings && JSON.parse(this.props.settings);

    const store = configureStore({
      settings: {
        APAccountID: settings.accountId,
        BundleIdentifier: BundleIdentifier,
        Store: platform.toLowerCase(),
      },
    }, process.env.NODE_ENV);


    let extra_props = this.props['extra_props'] && JSON.parse(this.props['extra_props']);
    global.zappConfig = extra_props['uibuilder_screen_model']['styles'];
    
    store.dispatch(loadChannels());

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
