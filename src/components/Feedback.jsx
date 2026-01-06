import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../config/api";

export default function Feedback() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          message: `Feedback: ${message}`,
        }),
      });
      const data = await res.json();
      setResponse(data.message);
      setMessage("");
      setTimeout(() => setResponse(""), 3000);
    } catch (err) {
      console.error("Feedback submit error:", err);
      setResponse("Failed to send feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-green-600 text-white">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Feedback</h3>
                    <p className="text-xs text-gray-500">Share your thoughts</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <div className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!user && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-2 top-2.5 text-gray-400" size={16} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full pl-8 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                          required
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Message
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-2 top-2.5 text-gray-400" size={16} />
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="What's on your mind?"
                        className="w-full pl-8 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm resize-none"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send size={14} />
                    {loading ? "Sending..." : "Send"}
                  </motion.button>
                </form>

                <AnimatePresence>
                  {response && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3 text-sm text-center text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg"
                    >
                      {response}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}