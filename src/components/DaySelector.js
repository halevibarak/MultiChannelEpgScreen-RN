import React, { Component } from 'react';
import { ViewPropTypes, StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setDays, selectDay } from '../actions';
import { loadChannels } from '../actions/channels';

import * as Size from '../helpers/size';
import * as Dates from '../helpers/dates'
import * as Zapp from '../zapp/config';

const mapStateToProps = state => ({
	days: state.app.days,
  selectedDay: state.app.selectedDay
});

const mapDispatchToProps = dispatch => bindActionCreators({
	setDays,
	selectDay,
	loadChannels
}, dispatch);

class DaySelector extends Component {
	static propTypes = {
    style: ViewPropTypes.style
	};
	
	styles = StyleSheet.create(getStylesObject());

	componentWillMount() {
		const days = Dates.getDays(5)
		this.props.setDays(days);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { days: oldDays, selectedDay: oldSelectedDay } = prevProps;
		const { days, selectedDay } = this.props;

		if (!days) {
			return;
		}

		if (!oldDays || !this.compareDays(oldDays, days)) {
			this.props.selectDay(days[0]);
			return;
		}

		if (!selectedDay) {
			return;
		}

		if (!oldSelectedDay || oldSelectedDay != selectedDay) {
			this.props.loadChannels(selectedDay);
		}
	}

	compareDays(oldDays, newDays) {
		var i = oldDays.length;
		while (i--) {
				if (oldDays[i] !== newDays[i]) return false;
		}
		return true
	}

	handleDaySelection = day => {
		this.props.selectDay(day);
	}

	getDay(day, isSelected) {
		const title = Dates.getDayTitle(day);

		return (
			<TouchableOpacity
				style={this.styles.dayContainer}
				onPress={() => this.handleDaySelection(day)}>
				<Text style={isSelected ? this.styles.daySelected : this.styles.day}>{title}</Text>
			</TouchableOpacity>
		);
	}

	getDays(days, selectedDay) {
		return days.map(day => {
			return this.getDay(day, day == selectedDay)
		});
	}

  render() {
		const { days, selectedDay } = this.props;

		if (!days) {
			return <View style={[this.props.style, this.styles.scrollView]}></View>
		}

		return (
			<ScrollView
				ref={this.bindScrollView}
				style={[this.props.style, this.styles.scrollView]}
				contentContainerStyle={this.styles.daysContainer}
				horizontal
				showsHorizontalScrollIndicator={false}
				directionalLockEnabled={true}>
				{this.getDays(days, selectedDay)}
			</ScrollView>
    );
  }
}

const daySelectorHeight = Size.scaledScreenSize(40);

const getStylesObject = () => ({
	scrollView: {
		paddingLeft: 16,
		paddingRight: 16,
		flex: 1,
		maxHeight: daySelectorHeight,
		height: daySelectorHeight,
		backgroundColor: Zapp.getColor('day_selector_bg_color')
	},
	daysContainer: {
		alignSelf: 'stretch',
		flexDirection: 'row',
		alignItems: 'center'
	},
	day: {
		marginRight: 22,
    ...Zapp.getFontStyleObject('day_selector_title_font')
	},
	daySelected: {
		marginRight: 22,
    ...Zapp.getFontStyleObject('day_selector_title_font', true)
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(DaySelector);
