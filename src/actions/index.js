
import { actionCreator } from './actionsHelpers';

/* CONSTANTS */
export const SET_DAYS = 'SET_DAYS';
export const SELECT_DAY = 'SELECT_DAY';

export const START_LOADING_CHANNELS = 'START_LOADING_CHANNELS';
export const DONE_LOADING_CHANNELS = 'DONE_LOADING_CHANNELS';

export const SHOW_PROGRAM_INFO = 'SHOW_PROGRAM_INFO';
export const HIDE_PROGRAM_INFO = 'HIDE_PROGRAM_INFO';

/* ACTIONS */
export const setDays = days => actionCreator(SET_DAYS, days);
export const selectDay = day => actionCreator(SELECT_DAY, day);

export const startLoadingChannels = () => actionCreator(START_LOADING_CHANNELS);
export const doneLoadingChannels = () => actionCreator(DONE_LOADING_CHANNELS);

export const showProgramInfo = (program) => actionCreator(SHOW_PROGRAM_INFO, program);
export const hideProgramInfo = () => actionCreator(HIDE_PROGRAM_INFO);
