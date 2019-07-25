import { List, fromJS } from 'immutable';

import { ADD_CHANNELS, UPDATE_CHANNEL } from '../actions/channels';

export default (state = List(), action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_CHANNELS:
      state = fromJS(payload);
      return state;

    case UPDATE_CHANNEL:
        state = updateChannelEpg(state, payload);
        return state;

    default:
      return state;
  }
};

function updateChannelEpg(state, updatedChannel) {
  return state.map(channel => {
    let isMatchedChannel = channel.get('id') === updatedChannel.id;
    return isMatchedChannel ? fromJS(updatedChannel) : channel;
  });
}

function updateSelectedChannel(state, selectedChannel) {
  return state.map(channel => {
    let isMatchedChannel = channel.get('id') === selectedChannel.id;
    return channel.set('isPlaying', isMatchedChannel);
  });
}
