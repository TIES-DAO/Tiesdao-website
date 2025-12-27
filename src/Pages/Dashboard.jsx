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
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [checkInLoading, setCheckInLoading] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const today = new Date().toISOString().split("T")[0];
  const checkedInToday = dashboardData?.last_checkin === today;
  const streak = dashboardData?.streak || 0;

  // -------------------------
  // INFINITE STREAK MILESTONES
  const getNextMilestone = (value) => {
    if (value < 7) return 7;
    if (value < 14) return 14;
    if (value < 30) return 30;
    if (value < 60) return 60;
    if (value < 100) return 100;
    if (value < 365) return 365;
    return Math.ceil(value / 100) * 100;
  };

  const milestone = getNextMilestone(streak);
  const progress = Math.min((streak / milestone) * 100, 100);

  // -------------------------
  // FETCH DASHBOARD DATA
  const fetchDashboard = async () => {
    try {
      const res = await fetch(
        "https://tiesdao-websitexx.onrender.com/api/dashboard",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // -------------------------
  // DAILY CHECK-IN
  const handleCheckIn = async () => {
    if (checkedInToday) return;

    try {
      setCheckInLoading(true);
      const res = await fetch(
        "https://tiesdao-websitexx.onrender.com/api/daily-streak/checkin",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-12 mt-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-gray-900 dark:text-white"
        >
          Dashboard
        </motion.h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          Welcome back,{" "}
          <span className="font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
            {user.username}
          </span>
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {/* DAILY STREAK */}
        <motion.div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-xl flex flex-col items-center">
          <div className="h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-600">
            <Flame className="text-white" size={36} />
          </div>

          <h3 className="mt-6 text-5xl font-black text-gray-900 dark:text-white">
            {streak}
            <span className="text-2xl text-gray-500"> days</span>
          </h3>

          <p className="mt-2 font-semibold text-gray-600 dark:text-gray-300">
            Daily Streak
          </p>

          <p className="mt-4 text-sm">
            {checkedInToday ? (
              <span className="inline-flex items-center gap-2 text-green-500 font-semibold">
                <CheckCircle2 size={16} />
                Checked in today
              </span>
            ) : (
              "Check in to keep your streak alive"
            )}
          </p>

          {/* PROGRESS */}
          <div className="mt-6 w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-orange-400 to-red-600"
            />
          </div>

          <p className="mt-2 text-xs font-semibold text-gray-500">
            Next milestone: {streak}/{milestone} days
          </p>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCheckIn}
            disabled={checkedInToday || checkInLoading}
            className={`mt-8 w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2
              ${
                checkedInToday
                  ? "bg-green-100 text-green-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
              }`}
          >
            {checkedInToday ? (
              <>
                <CheckCircle2 size={20} />
                Checked In
              </>
            ) : (
              <>
                <Flame size={20} />
                Check In Today
              </>
            )}
          </motion.button>
        </motion.div>

        {/* LEADERBOARD */}
        <LeaderboardCard
          title="Top Streak Leaders"
          data={dashboardData?.top_streak_users || []}
        />

        {/* REWARDS */}
        <RewardsCard />

        {/* ACTIVITY */}
        <motion.div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-green-500" />
            <h3 className="font-bold text-lg">Recent Activity</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex gap-2"><Flame size={16} /> Daily check-in</li>
            <li className="flex gap-2"><Trophy size={16} /> Leaderboard updated</li>
            <li className="flex gap-2"><Gift size={16} /> Rewards coming soon</li>
          </ul>
        </motion.div>

      </div>
    </section>
  );
}

// -------------------------
// LEADERBOARD CARD
function LeaderboardCard({ title, data }) {
  const sortedData = [...data].sort((a, b) => b.streak - a.streak);

  return (
    <motion.div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md">
      <h3 className="font-bold text-xl mb-4">{title}</h3>

      {sortedData.length ? (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {sortedData.map((user, idx) => (
            <li
              key={user.username}
              className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2"
            >
              <span className="flex items-center gap-2 font-semibold">
                <Trophy size={16} className="text-yellow-500" />
                #{idx + 1} {user.username}
              </span>
              <span className="flex items-center gap-1 font-black text-orange-500">
                <Flame size={16} />
                {user.streak}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No streak data yet</p>
      )}
    </motion.div>
  );
}

// -------------------------
// REWARDS CARD
function RewardsCard() {
  return (
    <motion.div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md text-center">
      <Gift className="mx-auto mb-4 text-pink-500" size={32} />
      <h3 className="font-bold text-xl">Rewards</h3>
      <p className="text-gray-500 mt-2">Coming Soon</p>
      <button className="mt-4 w-full py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed">
        Locked
      </button>
    </motion.div>
  );
}
