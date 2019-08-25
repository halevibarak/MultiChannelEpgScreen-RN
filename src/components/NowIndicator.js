import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes, StyleSheet, View } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { ScrollViewChild } from '@applicaster/react-native-directed-scrollview';

import * as Dates from '../helpers/dates'
import * as Zapp from '../zapp/config';

export default class NowIndicator extends Component {
	static propTypes = {
		style: ViewPropTypes.style,
		dayStart: PropTypes.number
	};

	state = {
		currentTimeWidth: 0
	};

	styles = StyleSheet.create(getStylesObject());

	updateCurrentTime() {
		const now = Dates.getCurrentTime();
		const width = Dates.getWidthForInterval(now - this.props.dayStart);

		this.setState({
			currentTimeWidth: width
		});
	}

	componentDidMount() {
		this.updateCurrentTime();

		this.nowIndicatorUpdater = setInterval(
			() => this.updateCurrentTime(),
			60 * 1000
		);
	}

	componentWillUnmount() {
		clearInterval(this.nowIndicatorUpdater);
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

	render() {
		return (
			<ScrollViewChild
				scrollDirection={'horizontal'}
				style={[this.styles.nowContainer, { left: this.state.currentTimeWidth }]}>
				{this.getNowIndicator()}
			</ScrollViewChild>
		);
	}
}

const getArrow = () => {
	return {
		size: 36,
		color: Zapp.getColor('program_list_now_indicator_color')
	}
}

const getStylesObject = () => ({
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
	}
});
