import {configureStore} from '@reduxjs/toolkit';
import counterSlice from './slice/counterSlice';
import userSlice from './slice/userSlice';
import signInSlice from './slice/signInSlice';
import signUpSlice from './slice/signUpSlice';

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    user: userSlice,
    sign_in: signInSlice,
    sign_up: signUpSlice,
  },
});
