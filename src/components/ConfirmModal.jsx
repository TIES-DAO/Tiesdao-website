import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

export default function ConfirmModal({ isOpen, title, message, type = "warning", onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              className={`bg-gradient-to-br rounded-2xl p-6 sm:p-8 border backdrop-blur-lg max-w-sm w-full shadow-2xl ${
                type === "delete"
                  ? "from-red-600/20 to-red-700/20 border-red-500/50"
                  : type === "success"
                  ? "from-green-600/20 to-green-700/20 border-green-500/50"
                  : "from-yellow-600/20 to-yellow-700/20 border-yellow-500/50"
              }`}
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>

              {/* ICON */}
              <div className="flex justify-center mb-4">
                {type === "delete" ? (
                  <div className="bg-red-500/20 p-4 rounded-full">
                    <AlertTriangle size={32} className="text-red-400" />
                  </div>
                ) : (
                  <div className="bg-yellow-500/20 p-4 rounded-full">
                    <AlertTriangle size={32} className="text-yellow-400" />
                  </div>
                )}
              </div>

              {/* TITLE */}
              <h3 className="text-2xl font-bold text-white text-center mb-2">
                {title}
              </h3>

              {/* MESSAGE */}
              <p className="text-gray-300 text-center mb-8 text-sm sm:text-base">
                {message}
              </p>

              {/* BUTTONS */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCancel}
                  className="flex-1 py-2.5 sm:py-3 bg-gray-600/50 border border-gray-400/50 rounded-lg font-semibold text-white hover:bg-gray-600/70 transition"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onConfirm}
                  className={`flex-1 py-2.5 sm:py-3 rounded-lg font-semibold text-white transition ${
                    type === "delete"
                      ? "bg-red-600/80 border border-red-400/50 hover:bg-red-600"
                      : type === "success"
                      ? "bg-green-600/80 border border-green-400/50 hover:bg-green-600"
                      : "bg-yellow-600/80 border border-yellow-400/50 hover:bg-yellow-600"
                  }`}
                >
                  {type === "delete" ? "Delete" : type === "success" ? "Confirm" : "Proceed"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
