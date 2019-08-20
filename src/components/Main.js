import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View, ActivityIndicator } from 'react-native';

import { connect } from 'react-redux';

import { DaySelector, ChannelList, ProgramInfo } from './index';

import * as Zapp from '../zapp/config';

const mapStateToProps = state => ({
  settings: state.settings,
  isLoading: state.app.loading,
  modalProgram: state.app.modalProgram
});

class Main extends Component {
  static propTypes = {
    loadingPrograms: PropTypes.bool,
    loadingChannels: PropTypes.bool,
  };
  
  styles = StyleSheet.create(getStylesObject());

  getLoading() {
    return (
      <View
        style={this.styles.loadingContainer}>
        <ActivityIndicator
          style={this.styles.loading}
          color={Zapp.getColor('loading_color')} />
      </View>
    );
  }

  render() {
    const { isLoading, isEmpty } = this.props;
    if (isLoading) {
      return this.getLoading();
    }

    return (
      <View
        style={this.styles.container}>
        <DaySelector 
          style={this.styles.days} />
        <ChannelList
          style={this.styles.channels} />
        <ProgramInfo />
      </View>
    );
  }
}

const getStylesObject = () => ({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: Platform.OS === 'ios' ? 49 : 0,
    backgroundColor: Zapp.getColor('screen_bg_color')
  },
  days: {
    flex: 1,
    alignSelf: 'stretch',
    zIndex: 2
  },
  channels: {
    flex: 1,
    alignSelf: 'stretch',
    zIndex: 1
  },
  loadingContainer: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: Zapp.getColor('screen_bg_color')
  },
  loading: {
    flex: 1,
    alignSelf: 'center'
  }
});

export default connect(mapStateToProps)(Main);
