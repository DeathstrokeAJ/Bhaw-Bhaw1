// redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: '',
  initialState: {
    email: '',
    password: '',
  },
  reducers: {
    saveCredentials: (state, action) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    clearCredentials: (state) => {
      state.email = '';
      state.password = '';
    },
  },
});

export const { saveCredentials, clearCredentials } = userSlice.actions;
export default userSlice.reducer;
