import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // Loader icon for animation
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://tiesdao-websiteert.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="max-w-md w-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden"
      >
        {/* Animated Gradient Border */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 -z-10"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        />

        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-center text-gray-400 text-sm mb-8">Sign in to your account</p>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="space-y-2"
          >
            <label className="block text-sm font-semibold text-gray-300">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-gray-600/50 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm"
              required
            />
          </motion.div>

          {/* Password */}
          <motion.div
            className="space-y-2"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <label className="block text-sm font-semibold text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-600/50 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm"
                required
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-200 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </motion.button>
            </div>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-red-600/20 border border-red-500/50 backdrop-blur"
            >
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59,130,246,0.5)" }}
            whileTap={{ scale: 0.95 }}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg transition-all mt-8
              ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/40"
              }`}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={22} /> : "Sign In"}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 font-bold hover:text-blue-300 transition">
              Create one
            </Link>
          </p>
        </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
