import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    token: '',
    username: 'Pengguna',
    avatar: {
      url: '',
    },
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    SetUsername(state, action) {
      state.username = action.payload;
    },
  },
});

export const {setToken, SetUsername} = userSlice.actions;

export default userSlice.reducer;
