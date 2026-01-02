import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config/api";
import ConfirmModal from "../components/ConfirmModal";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // email, code, reset
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ isOpen: false, type: "success", title: "", message: "" });

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({
        isOpen: true,
        type: "warning",
        title: "Required",
        message: "Please enter your email address",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Reset code sent! Check console (dev mode) or your email.",
        });
        setTimeout(() => {
          setStep("code");
          setMessage({ isOpen: false });
        }, 2000);
      } else {
        setMessage({
          isOpen: true,
          type: "warning",
          title: "Error",
          message: data.message || "Failed to send reset code",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({
        isOpen: true,
        type: "warning",
        title: "Error",
        message: "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!resetCode) {
      setMessage({
        isOpen: true,
        type: "warning",
        title: "Required",
        message: "Please enter the reset code",
      });
      return;
    }

    setLoading(true);
    try {
      // Just move to password reset step (code is verified when password is submitted)
      setStep("reset");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMessage({
        isOpen: true,
        type: "warning",
        title: "Required",
        message: "Please enter and confirm your password",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        isOpen: true,
        type: "warning",
        title: "Mismatch",
        message: "Passwords do not match",
      });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        isOpen: true,
        type: "warning",
        title: "Weak Password",
        message: "Password must be at least 6 characters",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resetCode, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Password reset successfully! Redirecting to login...",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage({
          isOpen: true,
          type: "warning",
          title: "Error",
          message: data.message || "Failed to reset password",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({
        isOpen: true,
        type: "warning",
        title: "Error",
        message: "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 p-8 backdrop-blur-xl">
          {/* Header */}
          <motion.div className="text-center mb-8">
            <div className="inline-block p-3 bg-purple-500/20 border border-purple-400/50 rounded-xl mb-4">
              <Lock size={32} className="text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-gray-400 text-sm">Recover access to your account</p>
          </motion.div>

          {/* Email Step */}
          {step === "email" && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleRequestReset}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">Enter the email associated with your account</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 rounded-lg transition"
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </motion.button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-gray-300 transition mt-4"
              >
                <ArrowLeft size={18} /> Back to Login
              </button>
            </motion.form>
          )}

          {/* Code Step */}
          {step === "code" && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleVerifyCode}
              className="space-y-4"
            >
              <div className="bg-blue-500/10 border border-blue-400/50 rounded-lg p-4 flex gap-3">
                <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-semibold mb-1">Check Console (Dev Mode)</p>
                  <p>Your reset code has been logged to the browser console. Copy it below.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Reset Code (6 digits)</label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-gray-400 mt-2">Enter the 6-digit code sent to your email</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || resetCode.length !== 6}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 rounded-lg transition"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </motion.button>

              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-gray-300 transition"
              >
                <ArrowLeft size={18} /> Change Email
              </button>
            </motion.form>
          )}

          {/* Reset Password Step */}
          {step === "reset" && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleResetPassword}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition"
                />
                <p className="text-xs text-gray-400 mt-2">At least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? "Resetting..." : <>
                  <Check size={20} /> Reset Password
                </>}
              </motion.button>

              <button
                type="button"
                onClick={() => setStep("code")}
                className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-gray-300 transition"
              >
                <ArrowLeft size={18} /> Use Different Code
              </button>
            </motion.form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Remembered your password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-purple-400 hover:text-purple-300 font-semibold transition"
            >
              Login here
            </button>
          </p>
        </div>
      </motion.div>

      {/* Modal */}
      <ConfirmModal
        isOpen={message.isOpen}
        title={message.title}
        message={message.message}
        type={message.type}
        onConfirm={() => setMessage({ isOpen: false })}
        onCancel={() => setMessage({ isOpen: false })}
      />
    </div>
  );
}
