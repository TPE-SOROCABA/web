import { useState, useEffect, useCallback } from 'react';
import { Timer } from 'lucide-react';

interface Props {
  targetDate: Date
}

export default function CountdownTimer({ targetDate }: Props) {
  const [backgroundColor, setBackgroundColor] = useState('blue');
  
  const calculateTimeRemaining = useCallback(() => {
    const currentTime = new Date();
    const total = Date.parse(String(targetDate)) - Date.parse(String(currentTime));
    const seconds = Math.floor((total / 1000) % 60).toString().padStart(2, '0');
    const minutes = Math.floor((total / 1000 / 60) % 60).toString().padStart(2, '0');
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
    const days = Math.floor(total / (1000 * 60 * 60 * 24))
    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  }, [targetDate]);
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  const getBackgroundColor = useCallback(() => {
    const timeRemaining = calculateTimeRemaining();
    if (timeRemaining.days > 1) {
      setBackgroundColor('blue');
    } else if (+timeRemaining.hours < 2) {
      setBackgroundColor('red');
    } else {
      setBackgroundColor('yellow');
    }
  }, [calculateTimeRemaining])

  useEffect(() => {
    const interval = setInterval(() => {
      getBackgroundColor();
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeRemaining, getBackgroundColor]);

  return (
    <div className={`
    flex flex-col md:flex-row items-center bg-[#374192] border-[1px] border-[solid] border-[#ccc] h-[46px] py-1 px-3 md:py-4 md:px-3 rounded-lg gap-2 justify-center
    ${backgroundColor === 'blue' ? 'bg-blue-900' : ''}
    ${backgroundColor === 'yellow' ? 'bg-yellow-900' : ''}
    ${backgroundColor === 'red' ? 'bg-red-500' : ''}
    `}>
      <div className='hidden md:flex'>
        <h3 className='text-white'>Prazo de Designação</h3>
      </div>
      <div className='hidden md:block'>
        <Timer color='white' />
      </div>
      <div className='flex py-1 px-3 md:py-4 md:px-3'>
        <span className='text-white pr-1'>{timeRemaining.days}D </span>{' '}
        <span className='text-white'>{timeRemaining.hours}:</span>
        <span className='text-white'>{timeRemaining.minutes}:</span>
        <span className='text-white'>{timeRemaining.seconds}</span>
      </div>
    </div>
  );
}

