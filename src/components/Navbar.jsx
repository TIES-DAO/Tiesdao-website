import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import LogoImg from "../assets/tdao.jpg"; // Add your logo path here

export default function Navbar() {
  const { dark, toggleTheme } = useTheme();

  const navItems = ["Features", "Roadmap", "Community", "Contact"];

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 dark:bg-black/70 px-6 py-3 shadow-lg shadow-black/20">
          
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
            transition={{ type: "spring", stiffness: 150 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src={LogoImg}
              alt="TIE DAO Logo"
              className="h-10 w-10 rounded-full border border-white/20 object-cover"
            />
            <span className="font-bold text-lg text-white">TIES DAO</span>
          </motion.div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            {navItems.map((item, idx) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * idx }}
                className="relative group font-medium transition-colors"
              >
                <span className="group-hover:text-white">{item}</span>
                <motion.span
                  layoutId="underline"
                  className="absolute -bottom-1 left-0 h-[2px] w-0 bg-blue-500 transition-all group-hover:w-full"
                />
              </motion.a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <motion.a
              href="#join"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:inline-flex rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition shadow-md shadow-blue-600/40"
            >
              Join DAO
            </motion.a>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ rotate: 20 }}
              whileTap={{ scale: 0.9, rotate: 0 }}
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 hover:bg-white/10 transition"
            >
              {dark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-200" />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
