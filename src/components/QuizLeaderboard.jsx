import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Crown,
  Flame,
  Target,
  Loader2,
  Star,
} from "lucide-react";

export default function QuizLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(
        "https://tiesdao-websitexr.vercel.app/api/quiz/leaderboard/quiz",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setLeaderboard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-black">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 to-black px-4 py-12">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Trophy className="text-black" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white">
              Quiz Leaderboard
            </h1>
            <p className="text-gray-400 text-sm">
              Top minds ranked by quiz performance
            </p>
          </div>
        </motion.div>

        {/* PODIUM (TOP 3) */}
        {leaderboard.length >= 3 && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[1, 0, 2].map((pos, i) => {
              const user = leaderboard[pos];
              if (!user) return null;

              return (
                <motion.div
                  key={pos}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-3xl p-6 text-center backdrop-blur-xl border border-white/10
                    ${
                      pos === 0
                        ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/10 scale-105"
                        : "bg-white/5"
                    }`}
                >
                  <Crown
                    className={`mx-auto mb-3 ${
                      pos === 0 ? "text-yellow-400" : "text-gray-400"
                    }`}
                    size={28}
                  />

                  <h3 className="text-xl font-black text-white">
                    {user.username || "Anonymous"}
                  </h3>

                  <p className="text-gray-400 text-sm">{user.email}</p>

                  <div className="mt-4 flex justify-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-green-400 font-bold">
                      <Flame size={14} /> {Math.round(user.quizPoints)} pts
                    </span>
                    <span className="flex items-center gap-1 text-blue-400">
                      <Star size={14} /> {user.quizzesCompleted}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* LEADERBOARD LIST */}
        <div className="space-y-3">
          {leaderboard.map((user, idx) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="flex items-center justify-between rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-4 hover:border-blue-500/50 transition"
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center font-black
                    ${
                      idx === 0
                        ? "bg-yellow-400 text-black"
                        : idx === 1
                        ? "bg-gray-300 text-black"
                        : idx === 2
                        ? "bg-orange-400 text-black"
                        : "bg-white/10 text-white"
                    }`}
                >
                  {idx + 1}
                </div>

                <div>
                  <p className="font-semibold text-white">
                    {user.username || "Anonymous User"}
                  </p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-1 text-green-400 font-bold">
                  <Flame size={14} />
                  {Math.round(user.quizPoints)}
                </span>
                <span className="flex items-center gap-1 text-blue-400">
                  <Target size={14} />
                  {user.quizzesCompleted}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {leaderboard.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20 text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10"
          >
            <Target className="mx-auto text-gray-400 mb-4" size={40} />
            <p className="text-gray-400 text-lg">
              No quiz attempts yet. Be the first to dominate 🧠🔥
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
