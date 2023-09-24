import { useState, useEffect } from "react";

const calculateTimeLeft = (endTime: Date): number => {
  const now: number = new Date().getTime();
  const difference = endTime.getTime() - now;

  if (difference < 0) return 0;
  return difference;
};

interface CountdownTimerProps {
  endTime: Date;
}

const CountdownTimer = ({ endTime }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (totalSeconds === 0) return "Ready";

    return `${hours}h:${String(minutes).padStart(2, "0")}m:${String(
      seconds
    ).padStart(2, "0")}s`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(endTime);
      setTimeLeft(newTimeLeft);
      if (newTimeLeft === 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endTime]);

  return <p className='text-center'> {formatTime(timeLeft)}</p>;
};

export default CountdownTimer;
