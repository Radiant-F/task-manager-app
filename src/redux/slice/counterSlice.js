import {createSlice} from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counterSlice',
  initialState: {
    count: 0,
    age: 0,
  },
  reducers: {
    incrementCount(state) {
      state.count += 1;
    },
    decrementCount(state) {
      state.count -= 1;
    },
    addCountBy(state, {payload}) {
      state.count = state.count + payload;
    },
    minusCountBy(state, {payload}) {
      state.count = state.count - payload;
    },
  },
});

export const {incrementCount, decrementCount, addCountBy, minusCountBy} =
  counterSlice.actions;

export default counterSlice.reducer;
