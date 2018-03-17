import { combineReducers } from "redux";
import { responsiveStateReducer } from 'redux-responsive';
import { routerReducer } from 'react-router-redux';

const appReducer = combineReducers({
  browser: responsiveStateReducer,
  router: routerReducer,
});

const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer;