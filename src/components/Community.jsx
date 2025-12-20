import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Community() {
  const socials = [
    {
      name: "X (Twitter)",
      link: "https://x.com/ties_dao",
      bgLight: "bg-gray-200 hover:bg-gray-300",
      bgDark: "bg-gray-800/60 hover:bg-gray-700/80",
      iconLight: "text-black",
      iconDark: "text-white",
    },
    {
      name: "WhatsApp",
      link: "https://chat.whatsapp.com/EsrrBZby3FwJoXXpWc4OsI",
      bgLight: "bg-green-100 hover:bg-green-200",
      bgDark: "bg-green-500/20 hover:bg-green-500/40",
      iconLight: "text-green-600",
      iconDark: "text-white",
    },
  ];

  return (
    <section
      id="community"
      className="relative py-24 px-6 overflow-hidden text-center"
    >
      {/* Background glows */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 h-[300px] w-[300px] rounded-full bg-blue-600/20 dark:bg-blue-500/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[250px] w-[250px] rounded-full bg-purple-500/20 dark:bg-purple-700/20 blur-[100px]" />
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
          className="inline-flex items-center gap-2 rounded-full border border-gray-400/30 bg-gray-100/20 dark:bg-gray-900/30 px-4 py-1 text-xs font-medium text-gray-800 dark:text-gray-300 backdrop-blur"
        >
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Community
        </motion.div>

        {/* Headline */}
        <h2 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-black dark:text-white">
          Join the <br />
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            TIE DAO Community
          </span>
        </h2>

        <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg">
          Connect with builders, founders, and contributors. Share ideas, get
          updates, and collaborate in a human-first Web3 ecosystem.
        </p>

        {/* Social Links */}
        <motion.div
          className="mt-12 flex justify-center gap-6 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {socials.map((social) => (
            <motion.a
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.1,
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-lg font-semibold transition backdrop-blur
                ${social.bgLight} dark:${social.bgDark}`}
              style={{ minWidth: "170px", justifyContent: "center" }}
            >
              {social.name.includes("X") ? (
                <FaXTwitter
                  className={`text-xl ${social.iconLight} dark:${social.iconDark}`}
                />
              ) : (
                <FaWhatsapp
                  className={`text-xl ${social.iconLight} dark:${social.iconDark}`}
                />
              )}
              {social.name}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
