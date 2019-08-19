import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes, StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import * as Dates from '../helpers/dates'
import * as Zapp from '../zapp/config';

export default class ChannelRow extends Component {
  static propTypes = {
    channel: PropTypes.objet,
    dayStart: PropTypes.number,
    showProgramInfo: PropTypes.func,
    style: ViewPropTypes.style
  };

  styles = StyleSheet.create(getStylesObject());

  handleProgramPress = program => {
    this.props.showProgramInfo(program);
  }
  
  getProgram(program) {
    const width = Dates.getWidthForInterval(program.end - program.start);
    const isCurrent = Dates.isCurrent(program.start, program.end);

    return (
      <TouchableOpacity
        onPress={() => this.handleProgramPress(program)}
        style={[this.styles.program, isCurrent && this.styles.currentProgram, {width: width}]}>
        <Text
          numberOfLines={1}
          style={this.styles.show}>{program.show}</Text>
        <Text
          numberOfLines={1}
          style={this.styles.episode}>{program.title}</Text>
      </TouchableOpacity>
    );
  }

  getBlankInterval(interval) {
    return (
      <View
        style={[this.styles.blank, { width: Dates.getWidthForInterval(interval) }]} />
    );
  }

  render() {
    const { channel } = this.props;

    let current = this.props.dayStart;

    let rowItems = [];
    
    channel.programs.forEach(program => {
      const interval = program.start - current;
      if (interval > 0) {
        rowItems.push(this.getBlankInterval(interval));
      }

      current = program.end;

      rowItems.push(this.getProgram(program));
    });

    return (
      <View
        style={this.styles.row}>
        {rowItems}
      </View>
    );
  }
}

const getStylesObject = () => ({
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  blank: {
    height: 58,
    borderWidth: 1,
    borderColor: Zapp.getColor('program_list_border_color'),
    backgroundColor: Zapp.getColor('program_list_bg_color')
  },
  program: {
    height: 58,
    paddingLeft: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Zapp.getColor('program_list_border_color'),
    backgroundColor: Zapp.getColor('program_list_bg_color')
  },
  currentProgram: {
    backgroundColor: Zapp.getColor('program_list_current_bg_color')
  },
  show: {
    ...Zapp.getFontStyleObject('program_title_font')
  },
  episode: {
    ...Zapp.getFontStyleObject('program_subtitle_font')
  }
});
