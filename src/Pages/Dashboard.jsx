// -------------------------
// DASHBOARD COMPONENT
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Trophy,
  Gift,
  Activity,
  Flame,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { user, loading, theme } = useAuth(); // assuming theme comes from navbar context
  const [dashboardData, setDashboardData] = useState(null);
  const [checkInLoading, setCheckInLoading] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const today = new Date().toISOString().split("T")[0];
  const checkedInToday = dashboardData?.last_checkin === today;
  const progress = (((dashboardData?.streak || 0) % 10) / 10) * 100;

  const fetchDashboard = async () => {
    try {
      const res = await fetch("https://tiesdao-websitexx.onrender.com/api/dashboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCheckIn = async () => {
    if (!dashboardData || checkedInToday) return;
    try {
      setCheckInLoading(true);
      const res = await fetch("https://tiesdao-websitexx.onrender.com/api/daily-streak/checkin", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setDashboardData((prev) => ({
        ...prev,
        streak: data.streak,
        last_checkin: data.last_checkin,
      }));
    } catch (err) {
      console.error("Check-in error:", err);
    } finally {
      setCheckInLoading(false);
    }
  };

  return (
    <section className="min-h-screen px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 mt-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight"
        >
          Dashboard
        </motion.h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          Welcome back, <span className="text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text font-bold">{user.username}</span>
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {/* DAILY STREAK */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white dark:bg-gray-800/80 p-8 shadow-xl hover:shadow-2xl transition-all border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm flex flex-col items-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-600 shadow-lg shadow-orange-500/40">
            <Flame className="text-white" size={36} />
          </div>

          <h3 className="mt-6 text-4xl sm:text-5xl font-black text-gray-900 dark:text-white">
            {dashboardData?.streak || 0}<span className="text-2xl text-gray-500 dark:text-gray-400">-Day</span>
          </h3>
          <p className="mt-2 text-lg font-semibold text-gray-600 dark:text-gray-300">Streak</p>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            {checkedInToday ? (
              <span className="inline-flex items-center gap-2 text-green-500 font-semibold">
                <CheckCircle2 size={16} /> Locked for today
              </span>
            ) : (
              "Check in to keep your momentum"
            )}
          </p>

          <div className="mt-6 w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-4 overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-orange-400 via-red-500 to-rose-600 shadow-lg shadow-orange-500/50"
            />
          </div>
          <p className="mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
            Cycle: {dashboardData?.streak % 10}/10
          </p>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCheckIn}
            disabled={checkedInToday || checkInLoading}
            className={`mt-8 w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-lg transition-all
              ${
                checkedInToday
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-600/40 hover:shadow-xl"
              }`}
          >
            {checkedInToday ? (
              <><CheckCircle2 size={20} /> Checked In</>
            ) : (
              <><Flame size={20} /> Check In Today</>
            )}
          </motion.button>

          {dashboardData?.last_checkin && (
            <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
              Last check-in: {dashboardData.last_checkin}
            </p>
          )}
        </motion.div>

        {/* TOP STREAK USERS */}
        <LeaderboardCard
          title="Top Streak Users"
          data={dashboardData?.collaborations || []}
        />

        {/* REWARDS */}
        <RewardsCard />

        {/* RECENT ACTIVITY */}
        <motion.div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-green-500" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Recent Activity</h3>
          </div>
          <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Flame className="text-orange-400" size={16} /> Daily streak check-in
            </li>
            <li className="flex items-center gap-2">
              <Trophy className="text-yellow-400" size={16} /> Top collaboration updated
            </li>
            <li className="flex items-center gap-2">
              <Gift className="text-pink-400" size={16} /> Rewards updated
            </li>
          </ul>
        </motion.div>

      </div>
    </section>
  );
}

// LeaderboardCard and RewardsCard same as previous, just added dark mode classes for text/bg


// -------------------------
// LEADERBOARD CARD
function LeaderboardCard({ title, data }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md hover:shadow-lg transition"
    >
      <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-4">{title}</h3>
      {data.length ? (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {data
            .sort((a, b) => b.streak - a.streak)
            .map((user, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition"
              >
                <span className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Users size={16} className="text-blue-500" />
                  {user.username}
                </span>
                <span className="text-yellow-500 font-bold">{user.streak} 🔥</span>
              </li>
            ))}
        </ul>
      ) : (
        <p className="text-gray-400 dark:text-gray-300">No streak data yet</p>
      )}
    </motion.div>
  );
}

// -------------------------
// REWARDS CARD
function RewardsCard() {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md hover:shadow-lg transition text-center"
    >
      <div className="flex justify-center mb-4">
        <Gift className="text-pink-500" size={32} />
      </div>
      <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Rewards</h3>
      <p className="text-gray-500 dark:text-gray-300 mb-4">Available rewards (Coming Soon)</p>
      <button className="w-full rounded-lg py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed font-semibold">
        Coming Soon
      </button>
    </motion.div>
  );
}
