import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const App = (props) => {
  let [isWorkMode, setIsWorkMode] = useState(true),
      [workTimer, setWorkTimer] = useState(3*1000),
      [breakTimer, setBreakTimer] = useState(5*1000),
      [currentTimer, setCurrentTimer] = useState(3*1000),
      [timerType, setTimerType] = useState('Down'),
      [isActive, setIsActive] = useState(false),
      [autoStart, setAutoStart] = useState(false),
      [lastUpdateTime, setLastUpdateTime] = useState(null),
      [intervalId, setIntervalId] = useState(null),
      [autoStartDelay, setAutoStartDelay] = useState(false),
      [workMinute, setWorkMinute] = useState(0),
      [workSecond, setWorkSecond] = useState(0),
      [breakMinute, setBreakMinute] = useState(0),
      [breakSecond, setBreakSecond] = useState(0);

  let elapsed = null;

  const timerInterval = () => {
    const isCountDown = timerType === 'Down';
    let now = Date.now();
    let activeTimerAmount = isWorkMode ? workTimer : breakTimer;
    if (!isActive) {
      lastUpdateTime = now;
      elapsed = 0;
      isActive = true;
    } else {
      elapsed = now - lastUpdateTime;
      lastUpdateTime = now;
    }

    if (isCountDown) elapsed = -elapsed; //subtract if we're counting down
    currentTimer += elapsed;

    let timerFinished;
    if (isCountDown) {
      timerFinished = () => currentTimer <= 0;
    } else {
      timerFinished = () => currentTimer >= activeTimerAmount;
    }
    if (timerFinished()) {
      isWorkMode = !isWorkMode;
      activeTimerAmount = isWorkMode ? workTimer : breakTimer;
      currentTimer = isCountDown ? activeTimerAmount : 0;
      lastUpdateTime = null;
      isActive = false;
      clearInterval(intervalId);

      if(!autoStart) {
        intervalId = null;
      } else {
        autoStartDelay = true;
        intervalId = setInterval(timerInterval, 1000);
      }
    } else {
      if (autoStartDelay) {
        autoStartDelay = false;
        clearInterval(intervalId);
        intervalId = setInterval(timerInterval, 100);
      }
    }

    setLastUpdateTime(lastUpdateTime);
    setIsActive(isActive);
    setCurrentTimer(currentTimer);
    setIsWorkMode(isWorkMode);
    setIntervalId(intervalId);
    setAutoStartDelay(autoStartDelay);
  }

  const handleButton = () => {
    if (!intervalId) {
      intervalId = setInterval(timerInterval, 100);
      setIntervalId(intervalId);
    } else {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsActive(false);
    }
  }

  const handleNext = () => {
    const isCountDown = timerType === 'Down';
    isWorkMode = !isWorkMode;
    const activeTimerAmount = isWorkMode ? workTimer : breakTimer;
    currentTimer = isCountDown ? activeTimerAmount : 0;
    lastUpdateTime = null;
    isActive = false;
    autoStartDelay = false;
    clearInterval(intervalId);

    if(!autoStart) {
      intervalId = null;
    } else {
      autoStartDelay = true;
      intervalId = setInterval(timerInterval, 1000);
    }

    setIsWorkMode(isWorkMode);
    setCurrentTimer(currentTimer);
    setLastUpdateTime(lastUpdateTime);
    setIsActive(isActive);
    setIntervalId(intervalId);
    setAutoStartDelay(autoStartDelay);
  }

  const handleMinute = (e) => {
    handleTime(e.target.id === 'workMinute' ? setWorkMinute : setBreakMinute, e.target.value, 0, 99);
  }

  const handleSecond = (e) => {
    handleTime(e.target.id === 'workSecond' ? setWorkSecond : setBreakSecond, e.target.value, 0, 59);
  }

  const handleTime = (setVal, val, min, max) => {
    val = val.replace(/\D/gi, '');
    if (val.length > 2) val = val.slice(0,2);
    if (val <= min) val = min;
    if (val >= max) val = max;
    setVal(val);
  }

  const handleSubmit = (e) => {
    setWorkTimer((workMinute * 60 * 1000) + (workSecond * 1000));
    setBreakTimer((breakMinute * 60 * 1000) + (breakSecond * 1000));

    e.preventDefault();
  }

  const handleRadio = (e) => {
    setTimerType(e.target.id === "countDown" ? 'Down' : 'Up');
  }

  return (
    <div>
      <h1>{isWorkMode ? 'Work' : 'Break'}</h1>
      <h2>{displayTime(currentTimer)}</h2>
      <button onClick={handleButton}>{isActive ? 'Pause' : 'Start'}</button>
      <button onClick={handleNext}>Next</button>
      <form onSubmit={handleSubmit}>
        <TimerInput label="Work" minuteId="workMinute" minute={workMinute} handleMinute={handleMinute}
          secondId="workSecond" second={workSecond} handleSecond={handleSecond} />
        <TimerInput label="Break" minuteId="breakMinute" minute={breakMinute} handleMinute={handleMinute}
          secondId="breakSecond" second={breakSecond} handleSecond={handleSecond} />
        <AutoStart handleCheckbox={(e) => setAutoStart(e.target.checked)} autoStart={autoStart}/>
        <TimerRadio handleRadio={handleRadio} timerType={timerType} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

const AutoStart = (props) => {
  return (
    <label>
      Auto Start
      <input type="checkbox" id="autoStart" name="autoStart" onChange={props.handleCheckbox} checked={props.autoStart} />
    </label>
  );
}

const TimerInput = (props) => {
  return (
    <label>
      {props.label}
      <input type="text" id={props.minuteId} value={props.minute} onChange={props.handleMinute} />
      :
      <input type="text" id={props.secondId} value={props.second} onChange={props.handleSecond} />
    </label>
  );
}

const TimerRadio = (props) => {
  return (
    <div>
      <label>
        Count Down
        <input type="radio" id="countDown" name="timerType" value="Count Down" onChange={props.handleRadio} checked={props.timerType === 'Down'} />
      </label>
      <label>
        Count Up
        <input type="radio" id="countUp" name="timerType" value="Count Up" onChange={props.handleRadio} checked={props.timerType === 'Up'} />
      </label>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

function displayTime(num) {
  const minutes = Math.floor(num/60000);
  const seconds = Math.floor((num-(minutes*60000))/1000);
  return padZero(minutes) + ':' + padZero(seconds);
}

function padZero(num) {
	num = num.toString().split('');
	return Array(1).fill(0).concat(num).slice(-2).join('');
}