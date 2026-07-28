// NextRunCard.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function useCountdown(targetDate) {
  const calculateRemaining = () => {
    const total = new Date(targetDate).getTime() - new Date().getTime();
    const clamped = Math.max(total, 0);
    return {
      total: clamped,
      days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
      hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((clamped / (1000 * 60)) % 60),
      seconds: Math.floor((clamped / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateRemaining());
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  return timeLeft;
}

function CountUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-12 w-14 overflow-hidden sm:h-14 sm:w-16">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.25 }}
           className="absolute inset-0 flex items-center justify-center text-3xl font-black tracking-tight text-gray-900 sm:text-4xl"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
        {label}
      </span>
    </div>
  );
}

export default function NextRunCard({
  targetDate,
  title = "",
  location = "",
  dayLabel = "",
  timeLabel = "",
  peopleGoing = 0,
}) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  return (
    <div className="flex h-full flex-col justify-between gap-5 rounded-[24px] border border-gray-100 bg-white p-6 sm:p-8 text-left shadow-lg shadow-gray-200/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1">
          <span className="text-xs">🔥</span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-800">
            Next Run
          </span>
        </div>

       <div className="mt-4">
  <h3 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
    {title}
  </h3>

 <p className="mt-2 text-base font-medium text-gray-700">
  {dayLabel} • {timeLabel}
</p>

 <p className="mt-1.5 text-base text-gray-500">
    At : {location}
  </p>
</div>

       <p className="mt-3 text-base text-blue-800">
          
          {peopleGoing} People have registered
        </p>
      </div>

      <div>
        <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
          <span>⏳</span>
          Starts In
        </p>

        <div className="mt-5 flex items-center justify-between">
          <CountUnit value={days} label="Days" />
          <span className="pb-6 text-2xl font-light text-gray-300">:</span>
          <CountUnit value={hours} label="Hrs" />
          <span className="pb-6 text-2xl font-light text-gray-300">:</span>
          <CountUnit value={minutes} label="Min" />
          <span className="pb-6 text-2xl font-light text-gray-300">:</span>
          <CountUnit value={seconds} label="Sec" />
        </div>
      </div>
    </div>
  );
}