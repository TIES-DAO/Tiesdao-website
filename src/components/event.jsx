import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaArrowRight,
  FaUsers,
} from "react-icons/fa";

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

      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
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

  const eventLink =
    "https://chat.whatsapp.com/E4phioOQ7W45u6yXFt9lPS?mode=gi_t";

  const eventImage =
    "https://files.fm/thumb_show.php?i=j56a4746ry";

  return (
    <section className="py-24 px-6 flex justify-center bg-gradient-to-b from-transparent via-gray-50 to-gray-100 dark:from-black dark:via-black dark:to-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          y: -10,
          rotateX: 4,
          rotateY: -4,
        }}
        transition={{ duration: 0.45 }}
        className="group relative w-full max-w-md rounded-3xl overflow-hidden
        bg-white/95 dark:bg-[#0c0c0c]
        border border-gray-200 dark:border-white/10
        shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* IMAGE SECTION */}
        <div className="relative h-80 overflow-hidden">
          {/* Loader */}
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-800 z-10" />
          )}

          {/* Main Image */}
          <motion.img
            src={eventImage}
            alt="July Mega Event"
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop";
            }}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{
              scale: imgLoaded ? 1 : 1.2,
              opacity: imgLoaded ? 1 : 0,
            }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full object-cover"
          />

          {/* Cinematic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                initial={{
                  x: Math.random() * 400,
                  y: 350,
                  opacity: 0,
                }}
                animate={{
                  y: -20,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          {/* Top Badge */}
          <div className="absolute top-4 left-4 z-20">
            {isLive ? (
              <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full animate-pulse">
                🔴 LIVE NOW
              </span>
            ) : (
              <span className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20">
                JULY EVENT
              </span>
            )}
          </div>

          {/* Bottom Text */}
          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-5 left-5 right-5 z-20"
          >
            <h2 className="text-3xl font-bold text-white">
              July Mega Event 🚀
            </h2>

            <p className="text-sm text-white/80 mt-1">
              Learn • Connect • Earn Opportunities
            </p>
          </motion.div>
        </div>

        {/* CONTENT */}
        <div className="p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              <span>July 1, 2026</span>
            </div>

            <div className="flex items-center gap-2">
              <FaUsers />
              <span>Open Access</span>
            </div>
          </div>

          {/* COUNTDOWN */}
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(timeLeft).map(([key, value]) => (
              <AnimatePresence mode="wait" key={key}>
                <motion.div
                  key={value}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl bg-gray-100 dark:bg-white/5
                  border border-gray-200 dark:border-white/10
                  py-4 text-center"
                >
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {String(value).padStart(2, "0")}
                  </p>

                  <span className="text-[10px] uppercase tracking-[2px] text-gray-500">
                    {key}
                  </span>
                </motion.div>
              </AnimatePresence>
            ))}
          </div>

          {/* Subtitle */}
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FaClock />
            <span>
              {isLive
                ? "The event has started"
                : "Countdown to launch"}
            </span>
          </div>

          {/* CTA */}
          <motion.a
            href={eventLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="mt-6 w-full inline-flex items-center justify-center gap-2
            rounded-2xl px-6 py-4 font-semibold text-white
            bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400
            shadow-lg"
          >
            Join Event Now <FaArrowRight />
          </motion.a>
        </div>

        {/* Glow Border */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 blur-2xl opacity-15" />
        </div>
      </motion.div>
    </section>
  );
        }
