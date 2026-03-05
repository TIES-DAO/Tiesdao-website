import { motion } from "framer-motion";
import { FaXTwitter } from "react-icons/fa6";
import { Globe } from "lucide-react";

export default function Collaboration() {
  return (
    <section
      id="collaboration"
      className="py-28 px-6 flex justify-center bg-gradient-to-b from-transparent to-gray-100 dark:to-black"
    >
      <motion.div
        whileHover={{ y: -15, scale: 1.04 }}
        transition={{ type: "spring", stiffness: 180 }}
        className="group relative w-full max-w-sm rounded-3xl overflow-hidden
        bg-white dark:bg-[#0c0c0c]
        border border-gray-200 dark:border-white/10
        shadow-2xl"
      >
        {/* Image */}
        <div className="h-72 relative overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            src="https://freeimage.host/i/qCZMLiP"
            alt="Collaborator"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-8 relative">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            ZyberChain
          </h3>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Web3 Engineer
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">
            {/* X Link */}
            <motion.a
              whileHover={{ x: 5 }}
              href="https://x.com/zyberchain"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold 
              text-blue-500 hover:text-blue-400 transition"
            >
              <FaXTwitter size={16} /> X Profile
            </motion.a>

            {/* Project Website */}
            <motion.a
              whileHover={{ x: 5 }}
              href="https://zyberchain.com/signup?ref=74b5e7aa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold
              text-purple-600 hover:text-purple-500 transition"
            >
              <Globe size={16} /> Project
            </motion.a>
          </div>
        </div>

        {/* Soft Glow Hover Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 blur-2xl opacity-20" />
        </div>
      </motion.div>
    </section>
  );
}
