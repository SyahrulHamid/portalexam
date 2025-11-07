import React from 'react';

interface TimerProps {
  timeRemaining: number;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining }) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const isLowTime = timeRemaining <= 60;

  return (
    <div className={`font-mono text-2xl font-bold p-2 rounded-md ${isLowTime ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>
      <span>{String(minutes).padStart(2, '0')}</span>:
      <span>{String(seconds).padStart(2, '0')}</span>
    </div>
  );
};

export default Timer;
