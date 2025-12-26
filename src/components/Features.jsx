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
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.15, duration: 0.7, type: "spring", stiffness: 100 }}
              className="p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-110 hover:-translate-y-2 transition-all duration-300 cursor-pointer bg-gradient-to-br from-gray-100/30 to-gray-200/10 dark:from-gray-800/60 dark:to-gray-900/40 backdrop-blur-md border border-white/20 dark:border-white/10 flex flex-col items-center text-center group"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.3, rotate: 12 }}
                className="mb-6 p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all"
              >
                {feature.icon}
              </motion.div>

              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white group-hover:text-blue-500 transition-colors">{feature.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
