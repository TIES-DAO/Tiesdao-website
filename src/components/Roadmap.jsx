import { motion } from "framer-motion";
import { Rocket, TrendingUp, Cpu, Layers } from "lucide-react"; // Step icons

export default function Roadmap() {
  const roadmapSteps = [
    {
      title: "Foundation & Launch",
      icon: <Rocket size={28} className="text-blue-500" />,
      items: [
        "Develop and launch TIES web app with core features (User Profile, Jobs, Project Dashboard)",
        "Establish social media presence and community channels",
        "Implement Escrow System and secure payment processing",
        "Launch TIES token and token economy",
      ],
    },
    {
      title: "Growth & Expansion",
      icon: <TrendingUp size={28} className="text-green-500" />,
      items: [
        "Implement Gamification features (badges, levels, rewards)",
        "Launch Referral Program and incentivize referrals",
        "Establish partnerships with relevant businesses and organizations",
        "Develop and launch Content Marketing strategy",
      ],
    },
    {
      title: "Optimization & Scaling",
      icon: <Cpu size={28} className="text-yellow-500" />,
      items: [
        "Optimize and refine TIES web app based on user feedback",
        "Implement analytics and tracking tools to monitor user behavior",
        "Scale infrastructure to support growing user base",
        "Launch mobile app for TIES web app",
      ],
    },
    {
      title: "Token Integration & Expansion",
      icon: <Layers size={28} className="text-red-500" />,
      items: [
        "Integrate TIES token with other blockchain platforms and exchanges",
        "Expand TIES web app to include more features and services",
        "Host TIES DAO hackathon and innovation challenge",
        "Review and plan for future development and expansion",
      ],
    },
  ];

  return (
    <section id="roadmap" className="relative py-20 px-6 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/30 dark:bg-blue-500/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-purple-500/20 dark:bg-purple-700/20 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-gray-400/30 bg-gray-200/10 dark:bg-gray-900/30 px-4 py-1 text-xs font-medium text-gray-800 dark:text-gray-300 backdrop-blur"
        >
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Roadmap
        </motion.div>

        {/* Headline */}
        <h2 className="mt-6 text-4xl sm:text-5xl md:text-5xl font-extrabold leading-tight tracking-tight text-black dark:text-white text-center">
          Our Journey <br />
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Ahead
          </span>
        </h2>

        <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg text-center">
          Foundation → Growth → Optimization → Token Expansion
        </p>

        {/* Roadmap timeline */}
        <div className="relative mt-12 border-l-2 border-gray-300/20 dark:border-gray-600/40">
          {roadmapSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.2 + index * 0.3,
                duration: 0.8,
                type: "spring",
                stiffness: 80,
              }}
              className="relative mb-12 pl-12"
            >
              {/* Step Icon */}
              <div className="absolute -left-6 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100/20 dark:bg-gray-800/40 border border-gray-300/30 dark:border-gray-600/50">
                {step.icon}
              </div>

              {/* Step Content */}
              <h3 className="text-2xl font-semibold mb-3 text-black dark:text-white">{step.title}</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-800 dark:text-gray-300">
                {step.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
