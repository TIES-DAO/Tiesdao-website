import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Loader2, Sparkles } from "lucide-react";
import API_BASE from "../config/api";

export default function ReferralLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/referral/leaderboard/referral`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      // Ensure data is an array with valid items
      setLeaderboard(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Leaderboard error:", err);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-black">
        <Loader2 className="w-12 h-12 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 to-black px-4 py-12 pt-24">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
            <Trophy className="text-black" size={26} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white">
              Referral Leaderboard
            </h1>
            <p className="text-gray-400 text-sm">
              Top influencers ranked by referral points
            </p>
          </div>
        </motion.div>

        {/* TABLE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-600 to-emerald-700 text-black">
                  <th className="px-6 py-4 text-left font-bold">Rank</th>
                  <th className="px-6 py-4 text-left font-bold">Username</th>
                  <th className="px-6 py-4 text-right font-bold">Referrals</th>
                  <th className="px-6 py-4 text-right font-bold">Points</th>
                </tr>
              </thead>

              <tbody>
                {leaderboard && Array.isArray(leaderboard) && leaderboard.length > 0 ? (
                  leaderboard.map((user, idx) => {
                    if (!user) return null; // Skip if user is undefined
                    const medal =
                      idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : null;

                    return (
                      <motion.tr
                        key={user._id || idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className={`border-b border-white/10 hover:bg-white/5 transition ${
                          idx < 3 ? "bg-green-500/10" : ""
                        }`}
                      >
                        {/* RANK */}
                        <td className="px-6 py-4 font-bold text-white">
                          {medal ? (
                            <span className="text-2xl">{medal}</span>
                          ) : (
                            idx + 1
                          )}
                        </td>

                        {/* USERNAME */}
                        <td className="px-6 py-4 font-semibold text-white">
                          {user.username || "Anonymous"}
                        </td>

                        {/* REFERRAL COUNT */}
                        <td className="px-6 py-4 text-right">
                          <span className="inline-block bg-blue-500/20 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full font-bold">
                            {user.referralsCount ?? 0}
                          </span>
                        </td>

                        {/* POINTS */}
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500/30 text-green-300 px-3 py-1 rounded-full font-bold">
                            <Sparkles size={14} />
                            {Math.round(user.referralPoints || 0)}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* EMPTY STATE */}
        {(!leaderboard || leaderboard.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-12 text-center"
          >
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              No referrals yet. Start sharing your link!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
