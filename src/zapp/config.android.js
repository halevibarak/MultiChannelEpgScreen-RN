export function getFontStyleObject(zappKey, isSelected) {
	let result = {};

	let family = global.zappConfig[zappKey + '_android'];
	if (family) {
		result['fontFamily'] = family;
	}

	let color = global.zappConfig[zappKey + '_color' + (isSelected ? '_selected' : '')];
	if (color) {
		result['color'] = color;
	}

	let size = global.zappConfig[zappKey + 'size'];
	if (size) {
		result['fontSize'] = parseInt(size);
	}

	return result;
}

export function getColor(configKey) {
	let configValue = global.zappConfig[configKey];
	return configValue || 'transparent';
}

export function getImage(imageKey) {
	return {uri: imageKey, cache: 'force-cache'};
}

export function getConfig(configKey) {
	let configValue = global.zappConfig[configKey];
	return (configValue && configValue.length > 0) || null;
}
