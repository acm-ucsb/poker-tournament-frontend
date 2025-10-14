import { useEffect, useState } from "react";

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0)
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center space-y-4 select-none pb-4">
      <div className="flex items-center justify-center text-4xl sm:text-6xl font-bold tracking-wider">
        <div className="relative flex flex-col items-center">
          <span className="w-[2ch]">{pad(timeLeft.days)}</span>
          <span className="absolute -bottom-6 text-sm md:text-base font-medium text-gray-300">
            Days
          </span>
        </div>
        <span className="mx-2 text-[#22c55e]">:</span>
        <div className="relative flex flex-col items-center">
          <span className="w-[2ch]">{pad(timeLeft.hours)}</span>
          <span className="absolute -bottom-6 text-sm md:text-base font-medium text-gray-300">
            Hours
          </span>
        </div>
        <span className="mx-2 text-[#22c55e]">:</span>
        <div className="relative flex flex-col items-center">
          <span className="w-[2ch]">{pad(timeLeft.minutes)}</span>
          <span className="absolute -bottom-6 text-sm md:text-base font-medium text-gray-300">
            Minutes
          </span>
        </div>
        <span className="mx-2 text-[#22c55e]">:</span>
        <div className="relative flex flex-col items-center">
          <span className="w-[2ch]">{pad(timeLeft.seconds)}</span>
          <span className="absolute -bottom-6 text-sm md:text-base font-medium text-gray-300">
            Seconds
          </span>
        </div>
      </div>
    </div>
  );
}
