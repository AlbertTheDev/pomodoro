import React from 'react';
import { Pomodoro } from './features/timer/Pomodoro';
import { PomoSettingsForm } from './features/timer/PomoSettingsForm';

const App = () => {
  return (
    <div>
      <Pomodoro />
      <PomoSettingsForm />
    </div>
  );
}

export default App;