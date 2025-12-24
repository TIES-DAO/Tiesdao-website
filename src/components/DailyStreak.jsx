import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Lock, CheckCircle2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function DailyStreak() {
  const { user } = useAuth();
  if (!user) return null;

  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [lastCheckin, setLastCheckin] = useState(null);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [error, setError] = useState("");

  const userId = user.id;
  const today = new Date().toISOString().split("T")[0];

  // ==========================
  // Load streak
  // ==========================
  const loadStreak = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("daily_streaks")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // No streak record yet
        await supabase.from("daily_streaks").insert({
          user_id: userId,
          streak: 0,
          last_checkin: null,
        });
        setStreak(0);
        setLastCheckin(null);
        setCheckedInToday(false);
      } else {
        setStreak(data.streak);
        setLastCheckin(data.last_checkin);
        setCheckedInToday(data.last_checkin === today);
      }
    } catch (err) {
      console.error("Load streak error:", err);
      setError("Failed to load streak.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Handle check-in
  // ==========================
  const handleCheckIn = async () => {
    if (checkedInToday) return;
    setLoading(true);
    setError("");

    try {
      const { data } = await supabase
        .from("daily_streaks")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      let newStreak = 1;

      if (data) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yestStr = yesterday.toISOString().split("T")[0];

        if (data.last_checkin === today) {
          setCheckedInToday(true);
          setLoading(false);
          return;
        }

        if (data.last_checkin === yestStr) {
          newStreak = data.streak + 1;
        }

        await supabase
          .from("daily_streaks")
          .update({ streak: newStreak, last_checkin: today })
          .eq("user_id", userId);
      } else {
        await supabase.from("daily_streaks").insert({
          user_id: userId,
          streak: 1,
          last_checkin: today,
        });
      }

      setStreak(newStreak);
      setLastCheckin(today);
      setCheckedInToday(true);
    } catch (err) {
      console.error("Check-in error:", err);
      setError("Failed to check in.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStreak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[120px]">
        <span className="text-gray-400 text-sm">Loading streak...</span>
      </div>
    );
  }

  const progress = ((streak % 10) / 10) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-sm rounded-3xl bg-white dark:bg-black p-6 text-center shadow-xl"
    >
      {/* Icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500">
        <Flame className="text-white" size={30} />
      </div>

      {/* Streak */}
      <h3 className="mt-4 text-3xl font-bold">{streak}-Day Streak</h3>

      {/* Status */}
      <p className="mt-2 text-sm text-gray-500">
        {checkedInToday ? (
          <span className="inline-flex items-center gap-1">
            <Lock size={14} /> Locked for today
          </span>
        ) : (
          "Check in to keep your momentum"
        )}
      </p>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Momentum cycle: {streak % 10}/10</p>
      </div>

      {/* Error */}
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      {/* Check-in Button */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={handleCheckIn}
        disabled={checkedInToday || loading}
        className={`mt-6 w-full rounded-xl px-6 py-3 font-semibold transition ${
          checkedInToday
            ? "bg-green-100 text-green-700 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-500"
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

      {/* Last Check-in */}
      {lastCheckin && (
        <p className="mt-3 text-xs text-gray-500">
          Last check-in: {lastCheckin}
        </p>
      )}
    </motion.div>
  );
}
