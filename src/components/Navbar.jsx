import {
  Sun,
  Moon,
  LogIn,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import LogoImg from "../assets/tdao.jpg";

export default function Navbar() {
  const { dark, toggleTheme } = useTheme();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = ["Home", "Features", "Roadmap", "Community", "Contact"];

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 dark:bg-black/40 backdrop-blur-xl px-5 py-3 shadow-xl">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <motion.img
              whileHover={{ rotate: 8, scale: 1.05 }}
              src={LogoImg}
              alt="TIES DAO"
              className="h-10 w-10 rounded-full border border-white/20 object-cover"
            />
            <span className="font-extrabold text-lg tracking-wide bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              TIES DAO
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8 text-sm">
            {navItems.map((item) => {
              const isHome = item === "Home";
              return isHome ? (
                <Link
                  key={item}
                  to="/"
                  className="relative font-semibold text-gray-300 hover:text-white transition"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 h-[3px] w-0 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all" />
                </Link>
              ) : (
                <a
                  key={item}
                  href={`/#${item.toLowerCase()}`}
                  className="font-semibold text-gray-300 hover:text-white transition"
                >
                  {item}
                </a>
              );
            })}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            {/* THEME */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
            >
              {dark ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} className="text-gray-200" />
              )}
            </motion.button>

            {/* AUTH */}
            {!user ? (
              <Link to="/login" className="hidden lg:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg"
                >
                  <LogIn size={16} className="inline mr-2" />
                  Login
                </motion.button>
              </Link>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <span className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-white border border-white/10">
                  <User size={15} className="text-blue-400" />
                  {user.username || "Anonymous"}
                </span>

                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg"
                  >
                    <LayoutDashboard size={16} className="inline mr-2" />
                    Dashboard
                  </motion.button>
                </Link>

                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg"
                >
                  <LogOut size={16} className="inline mr-2" />
                  Logout
                </motion.button>
              </div>
            )}

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="lg:hidden mt-2 mx-4 rounded-3xl bg-black/80 backdrop-blur-xl border border-white/10 p-6"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) =>
                item === "Home" ? (
                  <Link
                    key={item}
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="text-white font-semibold"
                  >
                    {item}
                  </Link>
                ) : (
                  <a
                    key={item}
                    href={`/#${item.toLowerCase()}`}
                    onClick={() => setMobileOpen(false)}
                    className="text-white font-semibold"
                  >
                    {item}
                  </a>
                )
              )}

              {user ? (
                <>
                  <Link to="/dashboard" className="text-green-400 font-semibold">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 font-semibold text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-blue-400 font-semibold">
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
