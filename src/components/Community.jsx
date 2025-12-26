import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Community() {
  const socials = [
    {
      name: "X (Twitter)",
      link: "https://x.com/ties_dao",
      icon: FaXTwitter,
      gradient: "from-blue-600 to-blue-500",
      hoverGradient: "from-blue-500 to-blue-400",
      shadowColor: "shadow-blue-600/40",
    },
    {
      name: "WhatsApp",
      link: "https://chat.whatsapp.com/EsrrBZby3FwJoXXpWc4OsI",
      icon: FaWhatsapp,
      gradient: "from-green-600 to-green-500",
      hoverGradient: "from-green-500 to-green-400",
      shadowColor: "shadow-green-600/40",
    },
  ];

  return (
    <section
      id="community"
      className="relative py-28 px-6 overflow-hidden text-center"
    >
      {/* Background glows */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/20 dark:bg-blue-500/15 blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/20 dark:bg-purple-700/15 blur-[140px] animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-3xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-bold text-green-300 backdrop-blur"
        >
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Community
        </motion.div>

        {/* Headline */}
        <h2 className="mt-8 text-5xl sm:text-6xl font-black tracking-tight text-white">
          Join the <br />
          <span className="bg-gradient-to-r from-blue-400 via-green-500 to-cyan-400 bg-clip-text text-transparent">
            TIES DAO Community
          </span>
        </h2>

        <p className="mt-6 text-gray-300 text-lg font-medium">
          Connect with builders, founders, and contributors. Share ideas, get
          updates, and collaborate in a human-first Web3 ecosystem.
        </p>

        {/* Social Links */}
        <motion.div
          className="mt-12 flex justify-center gap-8 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {socials.map((social, idx) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.name}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: `0 20px 40px rgba(0,0,0,0.4)`,
                }}
                whileTap={{ scale: 0.95 }}
                className={`group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all text-white overflow-hidden`}
              >
                {/* Animated gradient background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${social.gradient}`}
                  animate={{ backgroundPosition: ['0%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                />
                
                {/* Hover gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${social.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                />

                <div className="relative z-10 flex items-center gap-3">
                  <Icon size={24} className="group-hover:scale-125 transition-transform" />
                  <span>{social.name}</span>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
