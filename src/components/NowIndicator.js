import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import dates from '../../api/dates';

const NowIndicator = ({ offset, selectedDay }, { appStyles }) => {

  if (selectedDay !== dates.getToday()) {
    return <View />;
  }

  const indicatorColor = appStyles.NowLineColor;

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: (offset * 5) - 17,
      backgroundColor: 'transparent',
      zIndex: 10000000,
    },
    icon: {
      marginTop: -15,
      marginBottom: -15,
    },
    nowLine: {
      width: 1,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 17,
      backgroundColor: indicatorColor,
      zIndex: 10000000,
    },
  });

  return (
    <View style={ styles.container }>
      <Icon name="arrow-drop-down" size={ 36 } color={ indicatorColor } style={ styles.icon } />
      <View style={ styles.nowLine } />
    </View>
  );
};

NowIndicator.propTypes = {
  offset: PropTypes.number,
  selectedDay: PropTypes.string,
};

NowIndicator.contextTypes = {
  appStyles: PropTypes.object,
};

export default NowIndicator;
