import {combineReducers} from 'redux';
import themeSlice from '../slices/themeSlice/themeSlice';
import authSlice from '../slices/authSlice';
import profileSlice from '../slices/profileSlice';
import homeSlice from '../slices/homeSlice';
import matchSlice from '../slices/matchSlice';

const appReducer = combineReducers({
  theme: themeSlice,
  auth: authSlice,
  profile: profileSlice,
  home: homeSlice,
  match: matchSlice,
});


export default appReducer;
