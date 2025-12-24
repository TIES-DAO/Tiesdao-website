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
      const res = await fetch("http://localhost:5000/api/dashboard", {
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
      const res = await fetch("https://tiesdaobackend.vercel.app/api/daily-streak/checkin", {
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
    <section className="min-h-screen px-4 py-12 bg-transparent"> {/* transparent to follow navbar theme */}
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12 mt-20 text-center"> {/* mt-20 to push below navbar */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-wide"
        >
          Dashboard
        </motion.h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Welcome back, <span className="text-blue-500">{user.username}</span>
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* DAILY STREAK */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md hover:shadow-lg transition flex flex-col items-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 shadow-md">
            <Flame className="text-white" size={28} />
          </div>

          <h3 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {dashboardData?.streak || 0}-Day Streak
          </h3>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
            {checkedInToday ? (
              <span className="inline-flex items-center gap-1 text-green-500">
                <Lock size={14} /> Locked for today
              </span>
            ) : (
              "Check in to keep your momentum"
            )}
          </p>

          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-300">
            Cycle: {dashboardData?.streak % 10}/10
          </p>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleCheckIn}
            disabled={checkedInToday || checkInLoading}
            className={`mt-6 w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition
              ${
                checkedInToday
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-600/30"
              }`}
          >
            {checkedInToday ? (
              <><CheckCircle2 size={16} /> Checked In</>
            ) : (
              <><Flame size={16} /> Check In Today</>
            )}
          </motion.button>

          {dashboardData?.last_checkin && (
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-300">
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
