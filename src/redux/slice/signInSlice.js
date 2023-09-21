import {createSlice} from '@reduxjs/toolkit';

const signInSlice = createSlice({
  name: 'signInSlice',
  initialState: {
    loading: false,
    email: '',
    password: '',
  },
  reducers: {
    SetLoading(state) {
      state.loading = !state.loading;
    },
    SetEmail(state, {payload}) {
      state.email = payload;
    },
    SetPassword(state, {payload}) {
      state.password = payload;
    },
  },
});

export const {SetLoading, SetEmail, SetPassword} = signInSlice.actions;

export default signInSlice.reducer;
