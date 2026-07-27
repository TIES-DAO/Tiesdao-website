import { motion } from "framer-motion";

export default function Section({ id, children, className = "" }) {
  return (
    <motion.section
      id={id}
      className={`relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </motion.section>
  );
}