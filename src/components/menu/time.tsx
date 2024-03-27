import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface Props {
  targetDate: string | Date
}

export default function CountdownTimer({ targetDate }: Props) {

  const calculateTimeRemaining = () => {
    const currentTime = new Date();
    const total = Date.parse(String(targetDate)) - Date.parse(String(currentTime));
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex flex-col md:flex-row items-center bg-[#374192] border-[1px] border-[solid] border-[#ccc] h-[46px] py-1 px-3 md:py-4 md:px-3 rounded-lg gap-2 justify-center'>
      <div className='hidden md:flex'>
        <h3 className='text-white'>Prazo de Designação</h3>
      </div>
      <div className='hidden md:block'>
        <Timer color='white'/>
      </div>
      <div className='flex py-1 px-3 md:py-4 md:px-3'>
        <span className='text-white'>{timeRemaining.days}D </span>{' '}
        <span className='text-white'>{timeRemaining.hours}:</span>
        <span className='text-white'>{timeRemaining.minutes}:</span>
        <span className='text-white'>{timeRemaining.seconds}</span>
      </div>
    </div>
  );
}

