import {createSlice} from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counterSlice',
  initialState: {
    count: 0,
  },
  reducers: {
    increment(state) {
      state.count += 1;
    },
    decrement(state) {
      state.count -= 1;
    },
    incrementBy(state, action) {
      state.count = state.count + action.payload;
    },
    decrementBy(state, action) {
      state.count = state.count - action.payload;
    },
  },
});

export const {decrement, increment, incrementBy, decrementBy} =
  counterSlice.actions;

export default counterSlice.reducer;
