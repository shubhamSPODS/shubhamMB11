import {createSlice} from '@reduxjs/toolkit';

export const initialState = {
  isLoading: false,
};
export const authSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setLoading: (state, {payload}) => {
      state.isLoading = payload;
    },
  },
});

export const {setLoading} = authSlice.actions;

export default authSlice.reducer;
