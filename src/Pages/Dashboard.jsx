// -------------------------
// DASHBOARD (IMPROVED UI)
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Crown,
  Wallet,
  BarChart3,
  CheckCircle2,
  Home,
  BookOpen,
  Trophy,
  Gift,
  Share2,
  Hash,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import API_BASE from "../config/api";
import Web3Education from "../components/Web3Education";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [checkInLoading, setCheckInLoading] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const today = new Date().toLocaleDateString('en-CA');
  const streak = dashboardData?.streak || 0;
  const checkedInToday = dashboardData?.last_checkin === today;

  // -------------------------
  // STREAK MILESTONES
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
      const res = await fetch(`${API_BASE}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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

  // -------------------------
  // DAILY CHECK-IN
  const handleCheckIn = async () => {
    if (checkedInToday) return;

    try {
      setCheckInLoading(true);
      const res = await fetch(`${API_BASE}/api/daily-streak/checkin`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: today }),
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

  const leaderboard = dashboardData?.top_streak_users || [];
  const userRank = dashboardData?.user_rank;
  const totalStreakUsers = dashboardData?.total_streak_users;

  return (
    <section className="min-h-screen px-4 py-12 bg-gray-50 dark:bg-gray-950">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mt-24 mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-500">
          Welcome back,{" "}
          <span className="font-semibold text-blue-600">
            {user.username}
          </span>
        </p>
      </div>

      {/* NAV */}
      <div className="max-w-6xl mx-auto mb-8 flex gap-3 justify-center flex-wrap">
        {[
          { label: "Streak", path: "/dashboard", icon: Home },
          { label: "Quizzes", path: "/quiz", icon: BookOpen },
          { label: "Quiz Board", path: "/quiz-leaderboard", icon: Trophy },
          { label: "Referrals", path: "/referral", icon: Gift },
          { label: "Referral Board", path: "/referral-leaderboard", icon: Share2 },
        ].map(({ label, path, icon: Icon }) => (
          <Link
            key={label}
            to={path}
            className="px-5 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-medium hover:border-blue-500 transition flex items-center gap-2"
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
        <StreakCard
          streak={streak}
          progress={progress}
          milestone={milestone}
          checkedInToday={checkedInToday}
          onCheckIn={handleCheckIn}
          loading={checkInLoading}
        />

        <LeaderboardCard data={leaderboard} currentUser={user} />

        <RankCard rank={userRank} total={totalStreakUsers} />

        <RewardsCard visible={false} />

        <ActivityCard visible />

        <Web3Education />
      </div>
    </section>
  );
}

// -------------------------
// STREAK CARD
function StreakCard({
  streak,
  progress,
  milestone,
  checkedInToday,
  onCheckIn,
  loading,
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl bg-white dark:bg-gray-900 p-8 shadow-xl border border-gray-100 dark:border-gray-800"
    >
      <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <TrendingUp size={26} />
      </div>

      <h3 className="mt-6 text-5xl font-extrabold">{streak}</h3>
      <p className="text-sm text-gray-500 mt-1">Daily Streak</p>

      <div className="mt-6 h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
        />
      </div>

      <p className="mt-2 text-xs text-gray-500">
        {streak}/{milestone} days
      </p>

      <button
        onClick={onCheckIn}
        disabled={checkedInToday || loading}
        className={`mt-6 w-full py-3 rounded-xl font-semibold transition ${
          checkedInToday
            ? "bg-green-100 text-green-700"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {checkedInToday ? "Checked In" : "Check In Today"}
      </button>
    </motion.div>
  );
}

// -------------------------
function RankCard({ rank, total }) {
  if (!rank || !total) return null;

  return (
    <motion.div className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-md border border-gray-100 dark:border-gray-800">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Hash size={18} className="text-orange-500" /> Your Rank
      </h3>

      <div className="text-center">
        <div className="text-4xl font-black text-orange-500 mb-2">
          #{rank}
        </div>
        <p className="text-sm text-gray-500">
          out of {total} active streakers
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center">
        Keep checking in daily to climb the ranks!
      </div>
    </motion.div>
  );
}

// -------------------------
// LEADERBOARD
function LeaderboardCard({ data, currentUser }) {
  const sorted = [...data].sort((a, b) => b.streak - a.streak);

  return (
    <motion.div className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-md border border-gray-100 dark:border-gray-800">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Crown className="text-yellow-500" size={18} /> Top Streaks
      </h3>

      <ul className="space-y-2 max-h-64 overflow-y-auto text-sm">
        {sorted.map((u, i) => (
          <li
            key={i}
            className={`flex justify-between px-4 py-2 rounded-lg ${
              u.username === currentUser.username
                ? "bg-blue-50 dark:bg-blue-900/30 font-semibold"
                : "bg-gray-50 dark:bg-gray-800"
            }`}
          >
            <span>
              #{i + 1} {u.username}
            </span>
            <span>{u.streak}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// -------------------------
// REWARDS
function RewardsCard({ visible }) {
  if (!visible) return null;

  return (
    <motion.div className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-md border border-gray-100 dark:border-gray-800 text-center">
      <Wallet className="mx-auto text-purple-600" size={28} />
      <h3 className="mt-3 font-bold">Rewards</h3>
      <p className="text-sm text-gray-500 mt-1">
        Submit wallets to receive rewards
      </p>
      <button className="mt-4 w-full py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition">
        Claim Reward
      </button>
    </motion.div>
  );
}

// -------------------------
// ACTIVITY
function ActivityCard({ visible }) {
  if (!visible) return null;

  return (
    <motion.div className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-md border border-gray-100 dark:border-gray-800">
      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
        <BarChart3 size={18} /> Activity
      </h3>
      <ul className="text-sm text-gray-500 space-y-2">
        <li>Daily check-in completed</li>
        <li>Leaderboard updated</li>
        <li>Rewards pending</li>
      </ul>
    </motion.div>
  );
}
