import {combineReducers} from '@reduxjs/toolkit';
import appReducer from './appReducer';

const rootReducer = combineReducers({
  appReducer,
});

export default rootReducer;
