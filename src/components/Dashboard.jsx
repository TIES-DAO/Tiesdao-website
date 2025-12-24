import { motion } from "framer-motion";
import {
  Flame,
  Users,
  Trophy,
  Gift,
  Activity,
  ArrowUpRight
} from "lucide-react";
import DailyStreak from "./DailyStreak";

const card = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: "easeOut" }
  })
};

const IconWrap = ({ children, color }) => (
  <div
    className={`h-12 w-12 rounded-xl flex items-center justify-center
    bg-${color}-100 dark:bg-${color}-900/30`}
  >
    {children}
  </div>
);

export default function Dashboard() {
  return (
    <section className="relative py-24 px-6 bg-gray-50 dark:bg-black">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-14">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white"
        >
          Your Dashboard
        </motion.h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Activity, streaks, collaborations & rewards
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {/* DAILY STREAK */}
        <motion.div
          custom={0}
          variants={card}
          initial="hidden"
          animate="show"
          className="xl:row-span-2"
        >
          <DailyStreak />
        </motion.div>

        {/* COLLABORATION */}
        <motion.div
          custom={1}
          variants={card}
          initial="hidden"
          animate="show"
          className="rounded-3xl border border-gray-200/70 dark:border-white/10
          bg-white dark:bg-black p-6 shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Collaborations
              </h3>
              <p className="text-sm text-gray-500">
                Community engagement
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
              #3
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Rank this week
            </p>
          </div>

          <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-500">
            Open leaderboard <ArrowUpRight size={16} />
          </button>
        </motion.div>

        {/* LOOT / REWARDS */}
        <motion.div
          custom={2}
          variants={card}
          initial="hidden"
          animate="show"
          className="rounded-3xl border border-gray-200/70 dark:border-white/10
          bg-white dark:bg-black p-6 shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Gift className="text-orange-600 dark:text-orange-400" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Rewards
              </h3>
              <p className="text-sm text-gray-500">
                Your unlocked loot
              </p>
            </div>
          </div>

          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Trophy size={14} className="text-yellow-500" />
              7-Day Streak Badge
            </li>
            <li className="flex items-center gap-2 text-gray-400">
              <Flame size={14} />
              Early Contributor NFT (locked)
            </li>
          </ul>

          <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500
          text-white py-2 text-sm font-semibold shadow-lg">
            Claim Rewards
          </button>
        </motion.div>

        {/* ACTIVITY */}
        <motion.div
          custom={3}
          variants={card}
          initial="hidden"
          animate="show"
          className="rounded-3xl border border-gray-200/70 dark:border-white/10
          bg-white dark:bg-black p-6 shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Activity className="text-green-600 dark:text-green-400" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
          </div>

          <div className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>🔥 Daily streak check-in</p>
            <p>👀 Viewed collaborators</p>
            <p>🏆 Weekly rank updated</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
