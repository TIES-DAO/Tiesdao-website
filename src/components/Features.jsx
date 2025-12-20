import { motion } from "framer-motion";
import { MessageSquare, Briefcase, Trophy, ShieldCheck } from "lucide-react"; // Icons

export default function Features() {
  const features = [
    {
      title: "Yaps",
      description: "Engage and share updates with the community.",
      icon: <MessageSquare size={32} className="text-blue-500" />,
    },
    {
      title: "Jobs",
      description: "Find gigs or hire talent seamlessly.",
      icon: <Briefcase size={32} className="text-green-500" />,
    },
    {
      title: "Leaderboards",
      description: "Track top contributors and achievements.",
      icon: <Trophy size={32} className="text-yellow-500" />,
    },
    {
      title: "Escrow",
      description: "Secure transactions with confidence.",
      icon: <ShieldCheck size={32} className="text-red-500" />,
    },
  ];

  return (
    <section id="features"  className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/30 dark:bg-blue-500/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-purple-500/20 dark:bg-purple-700/20 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-6xl text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-gray-400/30 bg-gray-200/10 dark:bg-gray-900/30 px-4 py-1 text-xs font-medium text-gray-800 dark:text-gray-300 backdrop-blur"
        >
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Core Features
        </motion.div>

        {/* Headline */}
        <h2 className="mt-6 text-4xl sm:text-5xl md:text-5xl font-extrabold leading-tight tracking-tight text-black dark:text-white">
          Explore What <br />
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Powers the Platform
          </span>
        </h2>

        {/* Subtext */}
        <p className="mt-6 text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Everything you need to collaborate, earn, and grow in one human-first Web3 ecosystem.
        </p>

        {/* Feature cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.15, duration: 0.6, type: "spring", stiffness: 90 }}
              className="p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer bg-gray-100/20 dark:bg-gray-800/40 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="mb-4"
              >
                {feature.icon}
              </motion.div>

              <h3 className="text-2xl font-semibold mb-2 text-black dark:text-white">{feature.title}</h3>
              <p className="text-gray-800 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
