import React from "react";
import { motion } from "framer-motion";

export type TournamentEvent = {
  time: string;
  title: string;
  description?: string;
};

interface TournamentTimelineProps {
  events: TournamentEvent[];
}



const TournamentTimeline: React.FC<TournamentTimelineProps> = ({ events }) => {
  // Parse event times to timestamps
  const parseEventTime = (timeStr: string) => {
    // Try to parse with Date
    // Accepts formats like "Nov 8, 2:00 PM"
    const d = new Date(`${timeStr} ${new Date().getFullYear()}`);
    return d.getTime();
  };

  // Get current time
  const now = Date.now();

  // Get event timestamps
  const eventTimes = events.map(e => parseEventTime(e.time));

  // Find which event is next
  let currentIdx = 0;
  for (let i = 0; i < eventTimes.length; i++) {
    if (now < eventTimes[i]) {
      currentIdx = i;
      break;
    }
    currentIdx = i + 1;
  }
  // Clamp to last event
  if (currentIdx > events.length - 1) currentIdx = events.length - 1;

  // Calculate progress between previous and next event
  let progress = 0;
  if (eventTimes.length > 1) {
    if (currentIdx === 0) {
      // Before first event
      progress = 0;
    } else {
      const prevTime = eventTimes[currentIdx - 1];
      const nextTime = eventTimes[currentIdx];
      progress = Math.min(1, Math.max(0, (now - prevTime) / (nextTime - prevTime)));
    }
  }

  // Calculate bar height
  const stepHeight = 72; // px per step
  const offset = 40; // px offset for bar
  let barHeight = 0;
  if (currentIdx === 0) {
    barHeight = offset;
  } else {
    barHeight = currentIdx * stepHeight + offset + progress * stepHeight;
  }

  return (
    <div className="grid grid-cols-[48px_1fr] gap-x-8 gap-y-10 items-center justify-center relative">
      {/* Progress bar background */}
      <div className="absolute left-5 top-0 w-2.5 rounded bg-gray-200 -translate-y-5 z-0" style={{ height: `calc(100% + 40px)` }} />
      {/* Progress bar filled */}
      <div
          className="absolute left-5 top-0 w-2.5 rounded z-10 transition-all duration-300 -translate-y-5 bg-gradient-to-b from-green-400 via-green-500 to-green-600"
        style={{ height: `${barHeight}px` }}
      />
      {events.map((event, idx) => (
        <React.Fragment key={idx}>
          {/* Step number */}
          <div className="relative z-20 flex items-center justify-center h-12">
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300
                  ${idx < currentIdx ? "bg-gradient-to-b from-green-400 via-green-500 to-green-600 text-white" : "bg-gray-200 text-gray-400"}
                  ${idx === currentIdx ? "border-4 border-green-700 shadow-[0_0_0_4px_#22c55e]" : "border-2 border-gray-500"}
                `}
            >
              {idx + 1}
            </div>
          </div>
          {/* Animate the entire event block together */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 * idx }}
            className="flex flex-col items-start min-h-12"
          >
            <div
                className={`font-bold text-lg
                  ${idx < currentIdx ? "text-gray-400" : idx === currentIdx ? "text-green-500" : "text-white"}
                `}
            >
              {event.title}
            </div>
            <div className="text-gray-500 text-base">{event.time}</div>
            {event.description && (
              <div className="text-sm text-gray-400">{event.description}</div>
            )}
          </motion.div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TournamentTimeline;
