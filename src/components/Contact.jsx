import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      const data = await res.json();

      // Animate status change
      setStatus(data.message);
      if (res.ok) {
        setEmail("");
        setMessage("");
      }

      // Auto-clear status after 3 seconds
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setStatus("Failed to send message.");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <section  id="contact"  className="relative py-24 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/30 dark:bg-blue-500/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-purple-500/20 dark:bg-purple-700/20 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-2xl mx-auto text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-gray-400/20 bg-gray-100/10 dark:bg-gray-900/30 px-4 py-1 text-xs font-medium text-gray-800 dark:text-gray-300 backdrop-blur"
        >
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Get in Touch
        </motion.div>

        <h2 className="mt-6 text-4xl sm:text-5xl md:text-5xl font-extrabold leading-tight tracking-tight text-black dark:text-white">
          Contact <br />
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            TIE DAO
          </span>
        </h2>

        <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg">
          Reach out to us for inquiries, partnerships, or support.
        </p>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-col gap-6"
        >
          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="relative"
          >
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-14 py-5 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-300/20 dark:border-gray-600/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none text-lg transition"
              required
            />
          </motion.div>

          {/* Message Textarea */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="relative"
          >
            <MessageCircle className="absolute left-4 top-4 text-gray-400 dark:text-gray-500" />
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full pl-14 pt-5 pb-5 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-300/20 dark:border-gray-600/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-lg transition h-40 sm:h-48"
              required
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="rounded-2xl bg-blue-600 px-8 py-4 text-lg text-white font-semibold hover:bg-blue-500 transition shadow-lg shadow-blue-600/30"
          >
            Send Message
          </motion.button>

          {/* Status Message with Animation */}
          <AnimatePresence>
            {status && (
              <motion.p
                key={status}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className={`mt-2 text-lg font-medium ${
                  status.includes("Failed")
                    ? "text-red-500"
                    : status.includes("Sending")
                    ? "text-yellow-400"
                    : "text-green-500"
                }`}
              >
                {status}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>
      </motion.div>
    </section>
  );
}
