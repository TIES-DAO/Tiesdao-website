// -------------------------
// DASHBOARD COMPONENT
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Trophy,
  Gift,
  Activity,
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
  const streak = dashboardData?.streak || 0;
  const checkedInToday = dashboardData?.last_checkin === today;

  // -------------------------
  // INFINITE STREAK MILESTONE
  const getNextMilestone = (v) => {
    if (v < 7) return 7;
    if (v < 14) return 14;
    if (v < 30) return 30;
    if (v < 60) return 60;
    if (v < 100) return 100;
    if (v < 365) return 365;
    return Math.ceil(v / 100) * 100;
  };

  const milestone = getNextMilestone(streak);
  const progress = Math.min((streak / milestone) * 100, 100);

  // -------------------------
  // FETCH DASHBOARD
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
      console.log("DASHBOARD API RESPONSE:", data);
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

  // -------------------------
  // LEADERBOARD DATA
  const leaderboard = dashboardData?.top_streak_users || [];

  return (
    <section className="min-h-screen px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mt-24 mb-12 text-center">
        <h1 className="text-5xl font-black text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          Welcome back{" "}
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

          <button
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
              <><CheckCircle2 size={20} /> Checked In</>
            ) : (
              <><Flame size={20} /> Check In Today</>
            )}
          </button>
        </motion.div>

        {/* LEADERBOARD */}
        <LeaderboardCard data={leaderboard} currentUser={user} />

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
function LeaderboardCard({ data, currentUser }) {
  const sorted = [...data].sort((a, b) => b.streak - a.streak);
  const top = sorted.slice(0, 20);
  const userInTop = top.find(u => u.username === currentUser.username);

  const userRank = sorted.findIndex(u => u.username === currentUser.username) + 1;
  const userData = sorted.find(u => u.username === currentUser.username);

  return (
    <>
      <motion.div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <Trophy className="text-yellow-500" /> Top Streak Leaders
        </h3>

        {top.length ? (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {top.map((u, i) => (
              <li
                key={i}
                className={`flex justify-between items-center rounded-lg px-4 py-2 ${
                  u.username === currentUser.username
                    ? "bg-blue-100 dark:bg-blue-700"
                    : "bg-gray-50 dark:bg-gray-700"
                }`}
              >
                <span className="font-semibold">#{i + 1} {u.username}</span>
                <span className="flex items-center gap-1 font-black text-orange-500">
                  <Flame size={16} /> {u.streak}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No streak data yet</p>
        )}
      </motion.div>

      {/* CURRENT USER CARD IF NOT IN TOP */}
      {!userInTop && userData && (
        <motion.div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md mt-4">
          <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
            <Flame className="text-orange-500" /> Your Position
          </h3>
          <div className="flex justify-between items-center bg-blue-100 dark:bg-blue-700 rounded-lg px-4 py-2">
            <span className="font-semibold">#{userRank} {userData.username}</span>
            <span className="flex items-center gap-1 font-black text-orange-500">
              <Flame size={16} /> {userData.streak}
            </span>
          </div>
        </motion.div>
      )}
    </>
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
