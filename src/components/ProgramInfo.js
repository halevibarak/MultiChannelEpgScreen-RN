import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dimensions, StyleSheet, Modal, View, Image, Text} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Icon from '@applicaster/react-native-vector-icons/MaterialIcons';

import { hideProgramInfo } from '../actions';

import * as Dates from '../helpers/dates'
import * as Zapp from '../zapp/config';

const mapStateToProps = state => ({
	program: state.app.modalProgram
});

const mapDispatchToProps = dispatch => bindActionCreators({
  hideProgramInfo,
}, dispatch);

class ProgramInfo extends Component {
	styles = StyleSheet.create(getStylesObject());

	getText(program) {
		return (
			<View
				style={this.styles.infoContainer}>
				<Text
					numberOfLines={1}
					style={this.styles.title}>{program.show}</Text>
				<Text
					numberOfLines={5}
					style={this.styles.subtitle}>{program.description}</Text>
				<Text
					numberOfLines={1}
					style={this.styles.time}>{Dates.getTime(program.start)} - {Dates.getTime(program.end)}</Text>
				<Text
					numberOfLines={1}
					style={this.styles.time}>{Dates.getDate(program.start)}</Text>
			</View>
		);
	}

	getImage(program) {
		return (
			<View>
				<Image
					source={{ uri: program.imageUrl }}
					fallbackSource={Zapp.getImage('placeholder_big_item')}
					useQueryParamsInCacheKey={true}
					style={this.styles.image}/>
				<Icon
					name="close"
					size={24}
					color="#fff"
					onPress={this.props.hideProgramInfo}
					style={this.styles.close}/>
			</View>
		);
	}

	getContent(program) {
		if (!program) {
			return null;
		}

		return [
			this.getImage(program),
			this.getText(program)
		];
	}

  render() {
    const { program, hideProgramInfo } = this.props;
		
    return (
			<Modal
				transparent={true}
				visible={!!program}
				animationType={'fade'}
				onRequestClose={hideProgramInfo}
				style={this.styles.main}>
				<View
					style={this.styles.gradient}>
					<View
						style={this.styles.content}>
						{this.getContent(program)}
					</View>
        </View>
			</Modal>
    );
  }
}

const getStylesObject = () => ({
  main: {
    flex: 1,
		alignSelf: 'stretch',
	},
	gradient: {
    flex: 1,
		alignSelf: 'stretch',
		paddingVertical: 100,
		paddingHorizontal: 16,
		backgroundColor: Zapp.getColor('program_info_screen_bg_color')
	},
	content: {
		flex: 1,
		alignSelf: 'stretch',
		flexDirection: 'column',
		backgroundColor: 'black'
	},
	imageContainer: {
		flex: 1,
		alignSelf: 'stretch',
		flexDirection: 'row'
	},
	image: {
		alignSelf: 'stretch',
    height: 193
	},
	close: {
		width: 24,
		height: 24,
		position: 'absolute',
		top: 5,
		right: 5,
		borderRadius: 3,
		backgroundColor: '#909090',
		overflow: 'hidden'

	},
	infoContainer: {
		paddingHorizontal: 6
	},
	title: {
		paddingVertical: 18,
		...Zapp.getFontStyleObject('program_info_title_font')
	},
	subtitle: {
		...Zapp.getFontStyleObject('program_info_subtitle_font'),
		paddingBottom: 22
	},
	time: {
		...Zapp.getFontStyleObject('program_info_time_font')
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(ProgramInfo);
 