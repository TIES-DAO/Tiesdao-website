import { motion } from "framer-motion"; import { useEffect, useState } from "react"; import { FaCalendarAlt, FaClock } from "react-icons/fa";

export default function EventCard() { const eventDate = new Date("2026-07-01T00:00:00").getTime();

const [timeLeft, setTimeLeft] = useState(getTimeLeft()); const [isLive, setIsLive] = useState(false);

function getTimeLeft() { const now = new Date().getTime(); const distance = eventDate - now;

if (distance <= 0) {
  setIsLive(true);
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
}

return {
  days: Math.floor(distance / (1000 * 60 * 60 * 24)),
  hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
  minutes: Math.floor((distance / (1000 * 60)) % 60),
  seconds: Math.floor((distance / 1000) % 60),
};

}

useEffect(() => { const interval = setInterval(() => { setTimeLeft(getTimeLeft()); }, 1000);

return () => clearInterval(interval);

}, []);

return ( <section className="py-28 px-6 flex justify-center bg-gradient-to-b from-transparent to-gray-100 dark:to-black"> <motion.div whileHover={{ y: -15, scale: 1.05 }} transition={{ type: "spring", stiffness: 200 }} className="group relative w-full max-w-md rounded-3xl overflow-hidden bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 shadow-2xl" > {/* Image */} <div className="h-72 relative overflow-hidden"> <motion.img whileHover={{ scale: 1.12 }} transition={{ duration: 0.6 }} src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678" alt="Event" className="h-full w-full object-cover" />

<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* LIVE Badge */}
      {isLive && (
        <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full animate-pulse">
          🔴 LIVE NOW
        </div>
      )}
    </div>

    {/* Content */}
    <div className="p-8 text-center">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
        <FaCalendarAlt /> July Mega Event 🚀
      </h3>

      <p className="text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-2">
        <FaClock /> Countdown to Launch
      </p>

      {/* Countdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        {Object.entries(timeLeft).map(([key, value]) => (
          <motion.div
            key={key}
            className="flex flex-col items-center justify-center bg-gray-100 dark:bg-white/10 rounded-xl py-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.08 }}
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {String(value).padStart(2, "0")}
            </p>
            <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">
              {key}
            </span>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg"
      >
        Join Event
      </motion.button>
    </div>

    {/* Glow Effect */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 blur-2xl opacity-20" />
    </div>
  </motion.div>
</section>

); }
