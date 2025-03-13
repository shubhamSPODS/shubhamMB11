import {createSlice} from '@reduxjs/toolkit';
import {EnglishText, lightTheme} from '../../data/Preferences';
// import {lightTheme} from '../theme/color';

export const initialState = {
  defaultTheme: 'Light',
  colors: lightTheme,
  language: EnglishText,
};
export const themeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setTheme: (state, {payload}) => {
      state.defaultTheme = payload;
    },
    setColors: (state, {payload}) => {
      state.colors = payload;
    },
    setLanguage: (state, {payload}) => {
      state.language = payload;
    },
  },
});

export const {setTheme, setColors, setLanguage} = themeSlice.actions;

export const homeSelector = state => state.home;
export default themeSlice.reducer;
