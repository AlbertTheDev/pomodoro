import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workTimer: 3*1000,
  breakTimer: 5*1000,
  autoStart: false,
  timerType: 'Down',
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    timerUpdated(state, action) {
      const {workTimer, breakTimer, autoStart, timerType} = action.payload;
      state.workTimer = workTimer;
      state.breakTimer = breakTimer;
      state.autoStart = autoStart;
      state.timerType = timerType;
    }
  },
});

export const { timerUpdated } = timerSlice.actions;

export default timerSlice.reducer;