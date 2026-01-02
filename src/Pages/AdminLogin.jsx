import { useState } from "react";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import API_BASE from "../config/api";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/admin/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error("Invalid password");
      const data = await res.json();
      localStorage.setItem("adminToken", data.token);
      window.location.href = "/admin";
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <motion.form
        onSubmit={login}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gray-900/80 border border-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl"
      >
        <h1 className="text-3xl font-black text-white flex gap-2 mb-6">
          <Lock /> Admin Login
        </h1>

        <input
          type="password"
          placeholder="Admin password"
          className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-500 py-3 rounded-xl text-white font-bold hover:from-red-700 hover:to-red-600 cursor-pointer transition">
          Login
        </button>
      </motion.form>
    </div>
  );
}
