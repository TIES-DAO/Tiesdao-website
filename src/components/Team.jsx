import { motion } from "framer-motion";
import { FaXTwitter } from "react-icons/fa6";

import FounderImg from "../assets/wensy.jpg";
import CoFounderImg from "../assets/tonia.jpg";

export default function Team() {
  const team = [
    {
      role: "Founder",
      name: "Wensy ",
      handle: "@Wensywhinny",
      link: "https://x.com/wensywhinny",
      image: FounderImg,
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      role: "Co-Founder",
      name: "TONIA",
      handle: "@Toniaofweb3",
      link: "https://x.com/toniaofweb3?s=21",
      image: CoFounderImg,
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section id="team" className="relative py-28 px-6 text-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 h-[400px] w-[400px] bg-blue-600/20 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] bg-purple-600/20 blur-[140px] rounded-full animate-pulse" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto mb-16"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-300 backdrop-blur"
        >
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          Team
        </motion.div>

        <h2 className="mt-8 text-5xl sm:text-6xl font-black text-white leading-tight">
          Meet the <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Minds Behind TIES DAO
          </span>
        </h2>

        <p className="mt-6 text-gray-300 text-lg font-medium">
          Builders focused on trust, reputation, and real collaboration.
        </p>
      </motion.div>

      {/* Team cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {team.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.08, y: -10 }}
            className="group relative rounded-3xl p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-blue-500/30 hover:shadow-blue-600/20 transition-all"
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            />

            {/* Avatar */}
            <div className="relative mx-auto mb-8 w-32 h-32 z-10">
              {/* Gradient ring */}
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.gradient} blur-lg opacity-80`}
              />

              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative w-full h-full rounded-full p-1.5 bg-gray-900 border-2 border-white/20 group-hover:border-blue-400/50 transition-colors"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </motion.div>
            </div>

            <p className="text-xs uppercase tracking-widest font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
              {member.role}
            </p>

            <h3 className="mt-3 text-3xl font-black text-white">
              {member.name}
            </h3>

            <motion.a
              href={member.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 transition font-bold group/link relative z-10"
            >
              <FaXTwitter className="text-xl group-hover/link:rotate-12 transition-transform" />
              <span>{member.handle}</span>
            </motion.a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
