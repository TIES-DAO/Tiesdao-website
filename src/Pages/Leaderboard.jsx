import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { Trophy, Flame, Star, Crown } from "lucide-react";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await supabase
          .from("daily_streaks")
          .select("viewer_id, streak, username")
          .order("streak", { ascending: false })
          .limit(10);
        setLeaders(data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getMedalIcon = (idx) => {
    switch(idx) {
      case 0:
        return <Crown size={24} className="text-yellow-400" />;
      case 1:
        return <Trophy size={24} className="text-gray-300" />;
      case 2:
        return <Star size={24} className="text-orange-400" />;
      default:
        return <span className="text-gray-500 font-bold">#{idx + 1}</span>;
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 to-black px-6 py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 mb-6 mx-auto shadow-lg shadow-yellow-600/40"
          >
            <Trophy size={32} className="text-white" />
          </motion.div>
          
          <h2 className="text-5xl sm:text-6xl font-black text-white mb-3">
            Weekly Leaderboard
          </h2>
          <p className="text-gray-400 text-lg">Top streakers in the TIES DAO community</p>
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-400 text-lg">Loading leaderboard...</p>
            </motion.div>
          ) : leaders.length > 0 ? (
            leaders.map((user, idx) => (
              <motion.div
                key={user.viewer_id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className={`flex items-center justify-between p-6 rounded-2xl backdrop-blur-md border transition-all ${
                  idx === 0
                    ? "bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-yellow-500/50 shadow-lg shadow-yellow-600/20"
                    : idx === 1
                    ? "bg-gradient-to-r from-gray-600/30 to-gray-700/30 border-gray-500/50 shadow-lg shadow-gray-600/20"
                    : idx === 2
                    ? "bg-gradient-to-r from-orange-600/30 to-red-600/30 border-orange-500/50 shadow-lg shadow-orange-600/20"
                    : "bg-gray-800/40 border-gray-600/30 hover:bg-gray-700/40"
                }`}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="flex-shrink-0"
                  >
                    {getMedalIcon(idx)}
                  </motion.div>
                  
                  <div>
                    <p className="font-bold text-white text-lg">{user.username || "Anonymous"}</p>
                    <p className="text-gray-400 text-sm">{idx < 3 ? ["🥇 1st Place", "🥈 2nd Place", "🥉 3rd Place"][idx] : `Rank #${idx + 1}`}</p>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text">
                      {user.streak}
                    </p>
                    <p className="text-gray-400 text-xs">day streak</p>
                  </div>
                  <Flame size={28} className="text-orange-500 animate-bounce" />
                </motion.div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-400 text-lg">No leaderboard data available yet</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
