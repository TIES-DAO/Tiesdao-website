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
    <section id="team" className="relative py-24 px-6 text-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 h-[300px] w-[300px] bg-blue-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] bg-purple-500/20 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/40 px-4 py-1 text-xs font-medium text-gray-800 dark:text-gray-300 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Team
        </span>

        <h2 className="mt-6 text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          Meet the <br />
          <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Minds Behind TIES DAO
          </span>
        </h2>

        <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
          Builders focused on trust, reputation, and real collaboration.
        </p>
      </motion.div>

      {/* Team cards */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {team.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="relative rounded-3xl p-8 bg-white dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-xl"
          >
            {/* Avatar */}
            <div className="relative mx-auto mb-6 w-28 h-28">
              {/* Gradient ring */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.gradient} blur-md opacity-70`}
              />

              <div className="relative w-full h-full rounded-full p-1 bg-white dark:bg-black">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
              {member.role}
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {member.name}
            </h3>

            <a
              href={member.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
            >
              <FaXTwitter className="text-lg" />
              {member.handle}
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
