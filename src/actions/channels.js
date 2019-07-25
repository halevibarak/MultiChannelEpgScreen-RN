import { ZappPipesService } from 'react-native-zapp-bridge';

import { actionCreator } from './actionsHelpers';
import { startLoadingChannels, doneLoadingChannels } from './index';

import { getImageMediaItem, getExtensions, getTimestamp } from '../parser/atomFeedHelper';

import * as Dates from '../helpers/dates'
import * as Zapp from '../zapp/config'

/* CONSTANTS */

export const ADD_CHANNELS = 'ADD_CHANNELS';
export const UPDATE_CHANNEL = 'UPDATE_CHANNEL';

/* ACTIONS */
export const addChannels = channels => actionCreator(ADD_CHANNELS, channels);
export const updateChannel = channel => actionCreator(UPDATE_CHANNEL, channel);

/* THUNKS */

export const reloadChannel = channel => (dispatch, getState) => {
  fetchChannelEpg(channel.epgChannelId, (success, channelEpg) => {
    if (success) {
      let result = {
        ...channel,
        ...channelEpg
      };

      dispatch(updateChannel(result));
    }
  });
}

export const loadChannels = (day) => (dispatch, getState) => {
  dispatch(startLoadingChannels());

  ZappPipesService.getDataSourceData(`${getDspName()}://fetchData?type=channel-list`).then(feedData => {
    let channelsFeed = JSON.parse(feedData);

    if (channelsFeed && channelsFeed['entry']) {
      let loadingList = new Map();
      let orderMap = {};

      channelsFeed['entry'].forEach((channelEntry, index) => {
        let id = channelEntry['id'];
        if (id) {
          loadingList.set(id, channelEntry);
          orderMap[id] = index;
        }
      });

      if (loadingList.size == 0) {
        dispatch(doneLoadingChannels());
        return;
      }

      let loadedChannels = [];

      loadingList.forEach((channelEntry, channelId) => {
        fetchChannelEntry(channelEntry, day, (success, channel) => {

          if (success) {
            loadedChannels[orderMap[channel.id]] = channel;
          }

          loadingList.delete(channelId);

          if (loadingList.size == 0 && getState().app.loading) {
            let cleanLoadChannels = loadedChannels.filter(n => n);
            
            dispatch(addChannels(cleanLoadChannels));
            dispatch(doneLoadingChannels());
          }
        });
      });
    }
  })
  .catch(() => {
    if (getState().app.loading) {
      dispatch(doneLoadingChannels());
    }
  });
}

function fetchChannelEpg(epgChannelId, day, callback) {
  let dateParam = 'current=true';
  if (day) {
    const from = Dates.getStartDateForDSP(day);
    const to = Dates.getEndDateForDSP(day);

    dateParam = `from=${from}&to=${to}`;
  }

  const url = `${getDspName()}://fetchData?type=epg&channelId=${epgChannelId}&${dateParam}`;
  ZappPipesService.getDataSourceData(url).then(feedData => {
    if (!feedData) {
      callback(false);
      return;
    }

    let epgFeed = JSON.parse(feedData);
    if (!epgFeed) {
      callback(false);
      return;
    }

    let epgEntries = epgFeed['entry'];
    if (!epgEntries || epgEntries.length == 0) {
      callback(false);
      return;
    }

    let channel = {
      programs: []
    };

    epgEntries.forEach(epgEntry => {
      let program = {
        title: epgEntry['title'],
        description: epgEntry['summary'],
        ...getExtensions(epgEntry, {
          show: 'show_name',
          start: [getTimestamp, 'starts_at'],
          end: [getTimestamp, 'ends_at']
        }),
        imageUrl: getImageMediaItem(epgEntry)
      }

      channel.programs.push(program);
    });

    callback(true, channel);
  });
}

function fetchChannelEntry(channelEntry, day, callback) {
  let extensions = channelEntry['extensions'];
  if (!extensions) {
    callback(false);
    return
  }

  let epgChannelId = extensions['channel_id'];
  if (!epgChannelId) {
    callback(false);
    return
  }

  fetchChannelEpg(epgChannelId, day, (success, channelEpg) => {
    if (success) {
      callback(true, {
        id: channelEntry['id'],
        name: channelEntry['title'],
        epgChannelId: epgChannelId,
        imageUrl: getImageMediaItem(channelEntry) || 'placeholder_big_item',
        ...channelEpg
      });
    }
    else {
      callback(false);
    }
  });
}

function getDspName() {
  return Zapp.getConfig('dsp_name') || 'zappn';
}
