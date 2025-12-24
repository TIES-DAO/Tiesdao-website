import { Sun, Moon, LogIn, LayoutDashboard, LogOut, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import LogoImg from "../assets/tdao.jpg";

export default function Navbar() {
  const { dark, toggleTheme } = useTheme();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = ["Features", "Roadmap", "Community", "Contact"];

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 dark:bg-black/70 px-6 py-3 shadow-lg shadow-black/20">

          {/* LOGO */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
            transition={{ type: "spring", stiffness: 150 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src={LogoImg}
              alt="TIES DAO Logo"
              className="h-10 w-10 rounded-full border border-white/20 object-cover"
            />
            <span className="font-bold text-lg text-white tracking-wide">
              TIES DAO
            </span>
          </motion.div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            {navItems.map((item, idx) => (
              <motion.a
                key={item}
                href={`/#${item.toLowerCase()}`}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * idx }}
                className="relative group font-medium transition-colors hover:text-white"
              >
                {item}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-blue-500 transition-all group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          {/* ACTIONS & MOBILE MENU */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* THEME TOGGLE */}
            <motion.button
              whileHover={{ rotate: 20 }}
              whileTap={{ scale: 0.9, rotate: 0 }}
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 hover:bg-white/10 transition"
            >
              {dark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-200" />}
            </motion.button>

            {!user ? (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(59,130,246,0.7)" }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition shadow-md shadow-blue-600/40"
                >
                  <LogIn size={16} /> Login
                </motion.button>
              </Link>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                {/* Username */}
                <span className="flex items-center gap-1 rounded-full bg-gray-800/60 dark:bg-gray-700/50 px-3 py-1 text-sm text-white font-medium relative group hover:shadow-[0_0_10px_rgba(16,185,129,0.7)] transition-all">
                  <User size={14} />
                  {user.username || "Anonymous"}
                </span>

                {/* Dashboard */}
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(16,185,129,0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 transition shadow-md shadow-green-600/40"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </motion.button>
                </Link>

                {/* Logout */}
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(239,68,68,0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition shadow-md shadow-red-600/40"
                >
                  <LogOut size={16} /> Logout
                </motion.button>
              </div>
            )}

            {/* MOBILE MENU BUTTON */}
            <motion.button
              className="md:hidden flex items-center justify-center p-2 text-gray-200 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/80 backdrop-blur-xl border-t border-white/10"
          >
            <div className="flex flex-col gap-4 px-6 py-4">
              {navItems.map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-white font-medium py-2 hover:text-blue-400 transition">
                  {item}
                </a>
              ))}

              {user && (
                <>
                  <Link to="/dashboard" className="text-white font-medium py-2 hover:text-green-400 transition flex items-center gap-2">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white font-medium py-2 hover:text-red-400 transition flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              )}

              {!user && (
                <Link to="/login">
                  <button className="text-white font-medium py-2 hover:text-blue-400 transition flex items-center gap-2">
                    <LogIn size={16} /> Login
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
