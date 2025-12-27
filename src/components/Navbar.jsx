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

  const navItems = ["Home", "Features", "Roadmap", "Community", "Contact"];

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 flex items-center justify-between rounded-3xl border border-white/20 bg-gradient-to-r from-black/70 to-gray-900/70 dark:from-black/80 dark:to-gray-950/80 px-4 sm:px-6 py-3 shadow-xl shadow-black/40 backdrop-blur-md">

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
            <span className="font-bold text-lg md:text-xl text-white tracking-wider bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              TIES DAO
            </span>
          </motion.div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8 text-sm text-gray-300">
            {navItems.map((item, idx) => (
              item === "Home" ? (
                <motion.div
                  key={item}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <Link
                    to="/"
                    className="relative group font-semibold transition-all hover:text-white px-2 py-1"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 h-[3px] w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full rounded-full" />
                  </Link>
                </motion.div>
              ) : (
                <motion.a
                  key={item}
                  href={`/#${item.toLowerCase()}`}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * idx }}
                  className="relative group font-semibold transition-all hover:text-white px-2 py-1"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 h-[3px] w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full rounded-full" />
                </motion.a>
              )
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
                  whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(59,130,246,0.8)" }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden lg:flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-sm font-bold text-white hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-600/50"
                >
                  <LogIn size={16} /> Login
                </motion.button>
              </Link>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                {/* Username */}
                <span className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-800/70 to-gray-700/70 dark:from-gray-800 dark:to-gray-900 px-4 py-2 text-sm text-white font-semibold hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">
                  <User size={16} className="text-blue-400" />
                  {user.username || "Anonymous"}
                </span>

                {/* Dashboard */}
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(34,197,94,0.6)" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg shadow-green-600/50"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </motion.button>
                </Link>

                {/* Logout */}
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(239,68,68,0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-sm font-bold text-white hover:from-red-500 hover:to-rose-500 transition-all shadow-lg shadow-red-600/50"
                >
                  <LogOut size={16} /> Logout
                </motion.button>
              </div>
            )}

            {/* MOBILE MENU BUTTON */}
            <motion.button
              className="lg:hidden flex items-center justify-center p-2 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition-all"
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
                item === "Home" ? (
                  <Link key={item} to="/" className="text-white font-semibold py-3 hover:text-blue-400 transition block border-l-4 border-transparent hover:border-blue-500 px-3">
                    {item}
                  </Link>
                ) : (
                  <a key={item} href={`/#${item.toLowerCase()}`} className="text-white font-semibold py-3 hover:text-blue-400 transition block border-l-4 border-transparent hover:border-blue-500 px-3">
                    {item}
                  </a>
                )
              ))}

              {user && (
                <>
                  <Link to="/dashboard" className="text-white font-semibold py-3 px-3 hover:text-green-400 transition flex items-center gap-2 border-l-4 border-transparent hover:border-green-500">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white font-semibold py-3 px-3 hover:text-red-400 transition flex items-center gap-2 border-l-4 border-transparent hover:border-red-500"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              )}

              {!user && (
                <Link to="/login">
                  <button className="text-white font-semibold py-3 px-3 hover:text-blue-400 transition flex items-center gap-2 border-l-4 border-transparent hover:border-blue-500">
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
