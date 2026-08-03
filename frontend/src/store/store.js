// frontend/src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import problemReducer from './ProblemSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    problems: problemReducer,
  },
});

export default store;