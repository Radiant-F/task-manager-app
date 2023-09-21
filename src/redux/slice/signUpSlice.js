import {createSlice} from '@reduxjs/toolkit';

const signUpSlice = createSlice({
  name: 'signUpSlice',
  initialState: {
    loading: false,
    form_data: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  },
  reducers: {
    SetLoading(state) {
      state.loading = !state.loading;
    },
    SetFormData(state, {payload}) {
      state.form_data = {
        ...state.form_data,
        [payload.formName]: payload.value,
      };
    },
  },
});

export const {SetLoading, SetFormData} = signUpSlice.actions;

export default signUpSlice.reducer;
