import {
  SET_DAYS,
  SELECT_DAY,
  START_LOADING_CHANNELS,
  DONE_LOADING_CHANNELS,
  SHOW_PROGRAM_INFO,
  HIDE_PROGRAM_INFO
} from '../actions';

export default (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_DAYS:
      return {
        ...state,
        days: payload
    }

    case SELECT_DAY:
      return {
        ...state,
        selectedDay: payload
      };

    case START_LOADING_CHANNELS:
      return {
        ...state,
        loading: true
      };

    case DONE_LOADING_CHANNELS:
      return {
        ...state,
        loading: false
      };

    case SHOW_PROGRAM_INFO:
      return {
        ...state,
        modalProgram: payload
      };

    case HIDE_PROGRAM_INFO:
      return {
        ...state,
        modalProgram: null
      };

    default:
      return state;
  }
};
