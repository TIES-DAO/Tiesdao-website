import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaArrowRight } from "react-icons/fa";

export default function EventCard() {
  const eventDate = new Date("2026-07-01T00:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [isLive, setIsLive] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  function getTimeLeft() {
    const now = new Date().getTime();
    const distance = eventDate - now;

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

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🔗 Your event link
  const eventLink = "https://chat.whatsapp.com/E4phioOQ7W45u6yXFt9lPS?mode=gi_t";

  // 🖼️ BEST PRACTICE → Use local image
  const eventImage = "../assets/play.jpg"; // put image inside public folder

  return (
    <section className="py-28 px-6 flex justify-center bg-gradient-to-b from-transparent to-gray-100 dark:to-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -15, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="group relative w-full max-w-md rounded-3xl overflow-hidden
        bg-white dark:bg-[#0c0c0c]
        border border-gray-200 dark:border-white/10
        shadow-2xl"
      >
        {/* Image */}
        <div className="h-72 relative overflow-hidden">
          {/* Skeleton Loader */}
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-700" />
          )}

          <motion.img
            src={eventImage}
            alt="Event"
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/600x400?text=Event+Image";
            }}
            initial={{ scale: 1.1 }}
            animate={{ scale: imgLoaded ? 1 : 1.1, opacity: imgLoaded ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="h-full w-full object-cover brightness-90"
          />

          {/* Overlay */}
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
              <div key={key} className="flex flex-col items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full bg-gray-100 dark:bg-white/10 rounded-xl py-4 flex flex-col items-center justify-center"
                  >
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {String(value).padStart(2, "0")}
                    </p>
                    <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                      {key}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA */}
          <motion.a
            href={eventLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full 
            bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400
            text-white font-semibold shadow-lg"
          >
            Join Event <FaArrowRight />
          </motion.a>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 blur-2xl opacity-20" />
        </div>
      </motion.div>
    </section>
  );
        }
