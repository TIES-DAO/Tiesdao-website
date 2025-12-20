import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/tdao.jpg";

export default function Hero() {
  const [comingSoon, setComingSoon] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      
      {/* Background logo + glow */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <img
          src={Logo}
          alt="TIE DAO Logo"
          className="max-w-[600px] opacity-40 dark:opacity-60 object-contain"
        />

        <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/30 dark:bg-blue-500/20 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-white/20 dark:bg-white/10 blur-[100px]" />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="max-w-4xl text-center z-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-gray-300/20 bg-gray-100/10 dark:bg-gray-900/30 px-4 py-1 text-xs text-gray-800 dark:text-gray-300 backdrop-blur"
        >
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Human-First Web3 Collaboration
        </motion.div>

        {/* Headline */}
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-black dark:text-white">
          Where Web3 Collaboration <br />
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Becomes Human
          </span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          TIE DAO connects builders, founders, and contributors through trust,
          reputation, and real collaboration — not hype.
        </p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
        >
          {/* Join DAO */}
          <a
            href="https://x.com/ties_dao" // 🔁 replace with your real link
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/30"
          >
            Join TIES DAO
          </a>

          {/* Explore App (Coming Soon) */}
          <button
            onClick={() => setComingSoon(true)}
            className="relative rounded-xl border border-gray-400/30 px-8 py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 cursor-not-allowed backdrop-blur-sm overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/30 dark:bg-black/40 backdrop-blur-md" />
            <span className="relative z-10">Explore the App</span>
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex justify-center gap-8 text-sm text-gray-700 dark:text-gray-300"
        >
          <div>
            <span className="block text-black dark:text-white font-semibold">1k+</span>
            Builders
          </div>
          <div>
            <span className="block text-black dark:text-white font-semibold">200+</span>
            Projects
          </div>
          <div>
            <span className="block text-black dark:text-white font-semibold">$1.1k</span>
            Monthly Rewards
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg"
            onClick={() => setComingSoon(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl bg-white dark:bg-gray-900 p-8 text-center max-w-sm mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-black dark:text-white">
                🚧 Coming Soon
              </h3>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                The TIES DAO app is currently in development.  
                Stay tuned — big things are coming.
              </p>

              <button
                onClick={() => setComingSoon(false)}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition"
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
