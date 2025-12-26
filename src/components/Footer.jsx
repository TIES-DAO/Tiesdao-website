import { FaTwitter, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
  const socialLinks = [
    {
      icon: <FaTwitter />,
      url: "https://x.com/ties_dao", // Replace with your X/Twitter link
      color: "text-blue-400",
    },
    {
      icon: <FaWhatsapp />,
      url: "https://chat.whatsapp.com/EsrrBZby3FwJoXXpWc4OsI", // Replace with your WhatsApp link
      color: "text-green-500",
    },
  ];

  return (
    <footer className="relative py-16 px-6 text-center text-gray-400 overflow-hidden border-t border-white/10">
      {/* Background glows */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 h-[250px] w-[250px] rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[180px] w-[180px] rounded-full bg-purple-500/20 blur-[80px]" />
      </div>

      {/* Copy Right */}
      <p className="mb-8 text-gray-400 font-medium">
        © {new Date().getFullYear()} TIES DAO. All rights reserved.
      </p>

      {/* Social Icons */}
      <div className="flex justify-center gap-6 text-3xl">
        {socialLinks.map((link, idx) => (
          <motion.a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.4, rotate: 12 }}
            whileTap={{ scale: 0.9, rotate: -10 }}
            className={`p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300 ${link.color}`}
          >
            {link.icon}
          </motion.a>
        ))}
      </div>

      {/* Optional small slogan */}
      <p className="mt-8 text-gray-500 text-sm font-semibold">
        Building human-first Web3 communities.
      </p>
    </footer>
  );
}
