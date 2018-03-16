import { combineReducers } from "redux";
import { responsiveStateReducer } from 'redux-responsive';

const appReducer = combineReducers({
  browser: responsiveStateReducer,
});

const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer;