import React from 'react';
import { useStopwatch } from 'react-timer-hook';

const Timer = () => {
    const {
        seconds,
        minutes,
        hours,
      } = useStopwatch({ autoStart: true });
      
  return (
    <div style={{textAlign: 'center',marginTop:'5px'}}>
      <div style={{fontSize: '15px'}}>
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
};

export default Timer;
