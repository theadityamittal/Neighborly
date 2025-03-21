import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    // Add other reducers here as needed
  },
  // This enables Redux DevTools
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;