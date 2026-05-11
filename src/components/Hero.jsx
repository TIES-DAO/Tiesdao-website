import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, ArrowRight } from "lucide-react";
import Logo from "../assets/tdao.jpg";

export default function Hero() {
  const [comingSoon, setComingSoon] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-40">
          <img
            src={Logo}
            alt="TIES DAO Logo"
            className="max-w-[620px] object-contain select-none"
          />
        </div>

        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />
        <div className="absolute bottom-10 right-10 h-[300px] w-[300px] rounded-full bg-purple-500/20 blur-[120px]" />
        <div className="absolute top-10 left-10 h-[250px] w-[250px] rounded-full bg-pink-500/20 blur-[120px]" />

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 max-w-5xl text-center"
      >
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-gray-700 dark:text-gray-300 backdrop-blur-xl shadow-lg"
        >
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Human-First Web3 Collaboration
        </motion.div>

        {/* Heading */}
        <h1 className="mt-8 text-5xl sm:text-6xl md:text-7xl font-black leading-tight tracking-tight text-black dark:text-white">
          Where Web3 Collaboration
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Becomes Human
          </span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          TIES DAO connects builders, founders, and contributors through trust,
          reputation, and meaningful collaboration — not hype.
        </p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          {/* Join DAO */}
          <motion.a
            href="https://x.com/ties_dao"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="group flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-2xl shadow-blue-600/30 transition-all hover:bg-blue-500"
          >
            Join TIES DAO
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </motion.a>

          {/* Buy Ticket */}
          <motion.a
            href="https://www.lofte.live/events/6a01f839a87e839a3030ee07"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 30px rgba(168,85,247,0.5)",
            }}
            whileTap={{ scale: 0.96 }}
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 px-8 py-4 text-sm font-semibold text-white shadow-2xl"
          >
            {/* Shine Effect */}
            <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />

            <Ticket size={18} className="relative z-10" />
            <span className="relative z-10">Buy Tickets</span>
          </motion.a>

          {/* Explore App */}
          <button
            onClick={() => setComingSoon(true)}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 backdrop-blur-xl transition hover:bg-white/10"
          >
            Explore the App
          </button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-10 text-sm text-gray-700 dark:text-gray-300"
        >
          <div>
            <span className="block text-2xl font-bold text-black dark:text-white">
              1K+
            </span>
            Builders
          </div>

          <div>
            <span className="block text-2xl font-bold text-black dark:text-white">
              200+
            </span>
            Projects
          </div>
        </motion.div>
      </motion.div>

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {comingSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl"
            onClick={() => setComingSoon(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur-2xl shadow-2xl dark:bg-gray-900/80"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20">
                <div className="h-6 w-6 rounded-full bg-blue-500 animate-pulse" />
              </div>

              <h3 className="mt-6 text-3xl font-bold text-black dark:text-white">
                Coming Soon
              </h3>

              <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                The TIES DAO app is currently in development.
                Stay tuned — something powerful is on the way.
              </p>

              <button
                onClick={() => setComingSoon(false)}
                className="mt-8 rounded-2xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
              }
