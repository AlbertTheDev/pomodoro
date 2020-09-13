import { configureStore } from '@reduxjs/toolkit';
import timerSlice from '../features/timer/timerSlice';

export default configureStore({
  reducer: {
    timer: timerSlice,
  }
});