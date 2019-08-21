import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, ViewPropTypes, StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ScrollView, { ScrollViewChild } from '@applicaster/react-native-directed-scrollview';

import { ChannelRow } from './index';

import { showProgramInfo } from '../actions';

import * as Dates from '../helpers/dates'
import * as Zapp from '../zapp/config';

const mapStateToProps = state => ({
  channels: state.channels.toJS(),
  dayStart: state.app.selectedDay,
  isLoading: state.app.loading,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  showProgramInfo,
}, dispatch);

class ChannelList extends Component {
  static propTypes = {
    style: ViewPropTypes.style
  };

  state = {
    currentTimeWidth: 0
  }

  styles = StyleSheet.create(getStylesObject());
  positionY = 0;

  componentDidMount() {
    const { channels } = this.props;

    if (!channels || channels.length == 0) {
      return;
    }

    this.updateCurrentTime();

    this.nowIndicatorUpdater = setInterval(
      () => this.updateCurrentTime(),
      60 * 1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.nowIndicatorUpdater);
  }

  updateCurrentTime() {
    const now = Dates.getCurrentTime();
    const width = Dates.getWidthForInterval(now - this.props.dayStart);

    this.setState({
      currentTimeWidth: width
    });
  }

  scrollToNow = (animate) => {
    const now = Dates.getCurrentTime();
    const width = Dates.getWidthForInterval(now - this.props.dayStart);

    this.scrollViewRef.scrollTo({x: width, y: this.positionY, animated: animate});
  };

  getEmpty() {
    return (
      <View
        style={this.styles.emptyContainer}>
        <Text style={this.styles.emptyText}>No Channels</Text>
      </View>
    );
  }

  getGoToNow() {
    const { dayStart } = this.props;

    if (!dayStart || !Dates.isToday(dayStart)) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={() => this.scrollToNow(true)}
        style={this.styles.goToNowContainer}>
        <Text
          style={this.styles.goToNow}>Jetzt</Text>
      </TouchableOpacity>
    );
  }

  getNowIndicator() {
    const icon = (
      <Icon
        name="arrow-drop-down"
        {...getArrow()}
        style={this.styles.nowIcon} />
    );

    const line = (
      <View
        style={this.styles.nowLine} />
    );

    return [
      icon,
      line
    ];
  }

  getChannels(channels) {
    const rows = channels.map(channel => {
      return (
        <ChannelRow
          channel={channel}
          dayStart={this.props.dayStart}
          showProgramInfo={this.props.showProgramInfo}
          style={this.styles.programsRow} />
      );
    });

    return rows;
  }

  getLogo(channel) {
    return (
      <View
        onPress={() => {
          // Alert.alert(channel.name, String(channel.epgChannelId));
        }}
        style={this.styles.logoContainer}>
        <Image
          style={this.styles.logo}
          source={{ uri: channel.imageUrl }}
          resizeMode="contain" />
      </View>
    );
  }

  getLogos(channels) {
    const logos = channels.map(channel => {
      return this.getLogo(channel);
    });

    return logos;
  }

  getTime(time) {
    return (
      <View
        style={this.styles.timebarTimeContainer}>
        <Text
          style={this.styles.timebarTime}>{time}</Text>
        <View
          style={this.styles.timebarMark} />
      </View>
    );
  } 

  getTimebar() {
    const { dayStart } = this.props;

    const times = Dates.getTimes(dayStart).map(time => {
			return this.getTime(time)
		});

    return times;
  }

  render() {
    const { channels } = this.props;

    if (!channels || channels.length == 0) {
      return this.getEmpty()
    }

    return (
      <View
        style={[this.styles.main, this.props.style]}>
        <ScrollView
          bounces={false}
          bouncesZoom={false}
          maximumZoomScale={1.0}
          minimumZoomScale={1.0}
          pinchGestureEnabled={false}
          directionalLockEnabled={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={this.styles.content}
          onScroll={(event) => {
            this.positionY = event.nativeEvent.contentOffset.y
          }}
          onScrollEndDrag={(event) => {
            this.positionY = event.nativeEvent.contentOffset.y
          }}
          // onLayout={() => Dates.isToday(this.props.dayStart) && this.scrollToNow(false)}
          ref={ref => this.scrollViewRef = ref}
          style={this.styles.scroll}>
          <ScrollViewChild
            scrollDirection={'both'}
            style={this.styles.table}>
            {this.getChannels(channels)}
          </ScrollViewChild>
          <ScrollViewChild
            scrollDirection={'horizontal'}
            style={[this.styles.nowContainer, { left: this.state.currentTimeWidth }]}>
            {this.getNowIndicator()}
          </ScrollViewChild>
          <ScrollViewChild
            scrollDirection={'vertical'}
            style={this.styles.logos}>
            {this.getLogos(channels)}
          </ScrollViewChild>
          <ScrollViewChild
            scrollDirection={'horizontal'}
            style={this.styles.timebar}>
            {this.getTimebar()}
          </ScrollViewChild>
        </ScrollView>
        {this.getGoToNow()}
      </View>
    );
  }
}

const timeWidth = Dates.Program.DURATION_WIDTH_MINUTE_MULT * Dates.Program.TIMEBAR_MINUTES_INTERVAL;
const totalProgramsWidth = timeWidth*48;

const getArrow = () => { return {
  size: 36,
  color: Zapp.getColor('program_list_now_indicator_color')
}}

const getStylesObject = () => ({
  main: {
  },
  scroll: {
    flex: 1,
    alignSelf: 'stretch'
  },
  content: {
    width: totalProgramsWidth,
    flexGrow: 1
  },
  timebar: {
    paddingLeft: 87,
    height: 32,
    paddingTop: 4,
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: Zapp.getColor('timebar_bg_color')
  },
  timebarTimeContainer: {
    alignSelf: 'stretch',
    width: timeWidth,
    flexDirection: 'column'
  },
  timebarTime: {
    ...Zapp.getFontStyleObject('time_title_font')
  },
  timebarMark: {
    flex: 1,
    width: 1,
    backgroundColor: Zapp.getColor('timebar_mark_color')
  },
  logos: {
    width: 87,
    flexDirection: 'column',
    paddingTop: 32,
    borderRightWidth: 1,
    borderColor: Zapp.getColor('channel_list_vertical_border_color'),
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0
  },
  logoContainer: {
    height: 58,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Zapp.getColor('channel_list_vertical_border_color')
  },
  logo: {
    width: 64,
    height: 48,
  },
  programsRow: {
    height: 58
  },
  table: {
    paddingTop: 32,
    paddingLeft: 64
  },
  goToNowContainer: {
    width: 60,
    height: 32,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 14,
    bottom: 14,
    backgroundColor: Zapp.getColor('program_list_go_to_now_bg_color')
  },
  goToNow: {
    ...Zapp.getFontStyleObject('program_list_go_to_now_font')
  },
  nowContainer: {
    marginLeft: 87,
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'transparent'
  },
  nowIcon: {
    marginTop: 14,
    marginBottom: -14
  },
  nowLine: {
    flex: 1,
    width: 1,
    backgroundColor: Zapp.getColor('program_list_now_indicator_color')
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelList);
