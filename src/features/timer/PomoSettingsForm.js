import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { TimerTextInput } from './TimerTextInput';
import { timerUpdated } from './timerSlice';

export const PomoSettingsForm = () => {
  const [workMinute, setWorkMinute] = useState(0);
  const [workSecond, setWorkSecond] = useState(0);
  const [breakMinute, setBreakMinute] = useState(0);
  const [breakSecond, setBreakSecond] = useState(0);
  const [autoStart, setAutoStart] = useState(false);
  const [timerType, setTimerType] = useState('Down');

  const dispatch = useDispatch();

  const handleSubmitForm = () => {
    const workTimer = (workMinute * 60 * 1000) + (workSecond * 1000);
    const breakTimer = (breakMinute * 60 * 1000) + (breakSecond * 1000);
    dispatch(timerUpdated({ workTimer, breakTimer, autoStart, timerType }));
  };

  const WorkAndBreakTime = (
    <>
      Work 
      <TimerTextInput timeType="Minute" timeValue={workMinute} onTimeChange={setWorkMinute} />
      :
      <TimerTextInput timeType="Second" timeValue={workSecond} onTimeChange={setWorkSecond} />
      Break
      <TimerTextInput timeType="Minute" timeValue={breakMinute} onTimeChange={setBreakMinute} />
      :
      <TimerTextInput timeType="Second" timeValue={breakSecond} onTimeChange={setBreakSecond} />
    </>
  );

  const handleRadio = (e) => {
    setTimerType(e.target.id === 'countDown' ? 'Down' : 'Up');
  }

  const AutoStart = (
    <label>
      Auto Start
      <input type="checkbox" checked={autoStart} onChange={() => setAutoStart(!autoStart)} />
    </label>
  );

  const TimerRadio = (
    <div>
      <label>
        Count Down
        <input type="radio" id="countDown" name="timerType" value="Count Down" checked={timerType === 'Down'} onChange={handleRadio} />
      </label>
      <label>
        Count Up
        <input type="radio" id="countUp" name="timerType" value="Count Up" checked={timerType === 'Up'} onChange={handleRadio} />
      </label>
    </div>
  );

  return (
    <div>
      {WorkAndBreakTime}
      {AutoStart}
      {TimerRadio}
      <button type="button" onClick={handleSubmitForm}>Submit</button>
    </div>
  );
};