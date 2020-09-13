import React from 'react';

export const TimerTextInput = ({ timeType, timeValue, onTimeChange }) => {

  const handleTextChanged = (e) => {
    if (timeType === 'Minute') {
      handleMinute(e);
    } else {
      handleSecond(e);
    }
  }

  const handleMinute = (e) => {
    handleTime(e.target.value, 0, 99);
  }
  
  const handleSecond = (e) => {
    handleTime(e.target.value, 0, 59);
  }
  
  const handleTime = (val, min, max) => {
    val = val.replace(/\D/gi, '');
    if (val.length > 2) val = val.slice(0,2);
    if (val.length > 0) {
      if (val <= min) val = min;
      if (val >= max) val = max;
    }
    onTimeChange(val);
  }

  return (
    <input type="text" value={timeValue} onChange={handleTextChanged} />
  );
};

