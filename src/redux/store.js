// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import newsletterReducer from './newsletterSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    newsletter: newsletterReducer,
  },
});

export default store;
