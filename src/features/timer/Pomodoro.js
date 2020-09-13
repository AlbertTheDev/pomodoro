import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export const Pomodoro = () => {
  let [isWorkMode, setIsWorkMode] = useState(true),
      [currentTimer, setCurrentTimer] = useState(3*1000),
      [isActive, setIsActive] = useState(false),
      [lastUpdateTime, setLastUpdateTime] = useState(null),
      [intervalId, setIntervalId] = useState(null),
      [autoStartDelay, setAutoStartDelay] = useState(false);

  let workTimer = useSelector(state => state.timer.workTimer);
  let breakTimer = useSelector(state => state.timer.breakTimer);
  let autoStart = useSelector(state => state.timer.autoStart);
  let timerType = useSelector(state => state.timer.timerType);

  const timerInterval = () => {
    let elapsed = null;
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
  };

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

  const TimerType = <h1>{isWorkMode ? 'Work' : 'Break'}</h1>;
  const TimerDisplay = <h2>{displayTime(currentTimer)}</h2>
  const PomoButton = <button onClick={handleButton}>{isActive ? 'Pause' : 'Start'}</button>;
  const NextButton = <button onClick={handleNext}>Next</button>;

  return (
    <div>
      {TimerType}
      {TimerDisplay}
      {PomoButton}
      {NextButton}
    </div>
  );
};

function displayTime(num) {
  const minutes = Math.floor(num/60000);
  const seconds = Math.floor((num-(minutes*60000))/1000);
  return padZero(minutes) + ':' + padZero(seconds);
}

function padZero(num) {
	num = num.toString().split('');
	return Array(1).fill(0).concat(num).slice(-2).join('');
}