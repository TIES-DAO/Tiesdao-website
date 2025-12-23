import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, CheckCircle2, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";

// ==========================
// GET VIEWER ID (LOCAL)
// ==========================
const getViewerId = () => {
  let id = localStorage.getItem("viewer_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("viewer_id", id);
  }
  return id;
};

const STREAK_GOAL = 7;

export default function DailyStreak() {
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [lastCheckin, setLastCheckin] = useState(null);
  const [checkedInToday, setCheckedInToday] = useState(false);

  const viewerId = getViewerId();
  const today = new Date().toISOString().split("T")[0];

  // ==========================
  // LOAD STREAK
  // ==========================
  const loadStreak = async () => {
    const { data } = await supabase
      .from("daily_streaks")
      .select("*")
      .eq("viewer_id", viewerId)
      .single();

    if (data) {
      setStreak(data.streak);
      setLastCheckin(data.last_checkin);
      setCheckedInToday(data.last_checkin === today);
    }

    setLoading(false);
  };

  // ==========================
  // CHECK IN
  // ==========================
  const handleCheckIn = async () => {
    if (checkedInToday) return;

    let newStreak = 1;

    if (lastCheckin) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const y = yesterday.toISOString().split("T")[0];
      newStreak = lastCheckin === y ? streak + 1 : 1;
    }

    await supabase.from("daily_streaks").upsert({
      viewer_id: viewerId,
      streak: newStreak,
      last_checkin: today,
    });

    setStreak(newStreak);
    setLastCheckin(today);
    setCheckedInToday(true);
  };

  useEffect(() => {
    loadStreak();
  }, []);

  if (loading) return null;

  // ==========================
  // PROGRESS BAR
  // ==========================
  const progress = Math.min(
    ((streak % STREAK_GOAL) / STREAK_GOAL) * 100,
    100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="mx-auto mt-12 max-w-sm rounded-3xl border border-gray-200/70 dark:border-white/10 
      bg-white dark:bg-black p-6 text-center shadow-xl"
    >
      {/* ICON */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full 
        bg-gradient-to-br from-orange-400 to-red-500 shadow-lg">
        <Flame className="text-white" size={28} />
      </div>

      {/* STREAK */}
      <h3 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">
        {streak}-Day Streak
      </h3>

      {/* STATUS */}
      <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        {checkedInToday ? (
          <>
            <Lock size={14} className="text-green-500" />
            <span>You’re locked in for today</span>
          </>
        ) : (
          <span>Check in daily to build momentum</span>
        )}
      </div>

      {/* PROGRESS BAR */}
      <div className="mt-5">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Weekly Goal</span>
          <span>
            {streak % STREAK_GOAL}/{STREAK_GOAL} days
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500"
          />
        </div>
      </div>

      {/* BUTTON */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={handleCheckIn}
        disabled={checkedInToday}
        className={`mt-6 w-full flex items-center justify-center gap-2 rounded-xl 
          px-6 py-3 text-sm font-semibold transition ${
            checkedInToday
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-600/30"
          }`}
      >
        {checkedInToday ? (
          <>
            <CheckCircle2 size={16} /> Checked In
          </>
        ) : (
          <>
            <Flame size={16} /> Check In Today
          </>
        )}
      </motion.button>

      {/* FOOTER */}
      {lastCheckin && (
        <p className="mt-3 text-xs text-gray-500">
          Last check-in: <span className="font-medium">{lastCheckin}</span>
        </p>
      )}
    </motion.div>
  );
}
