import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Loader2, Sparkles } from "lucide-react";

export default function ReferralLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/referral/leaderboard/referral",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setLeaderboard(data);
    } catch (err) {
      console.error("Leaderboard error:", err);
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
    <section className="min-h-screen bg-gradient-to-br from-gray-950 to-black px-4 py-12">
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
                  <th className="px-6 py-4 text-left font-bold">User</th>
                  <th className="px-6 py-4 text-left font-bold">Email</th>
                  <th className="px-6 py-4 text-right font-bold">Points</th>
                  <th className="px-6 py-4 text-right font-bold">Code</th>
                </tr>
              </thead>

              <tbody>
                {leaderboard.map((user, idx) => {
                  const medal =
                    idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : null;

                  return (
                    <motion.tr
                      key={user._id}
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

                      {/* EMAIL */}
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {user.email}
                      </td>

                      {/* POINTS */}
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500/30 text-green-300 px-3 py-1 rounded-full font-bold">
                          <Sparkles size={14} />
                          {Math.round(user.referralPoints)}
                        </span>
                      </td>

                      {/* CODE */}
                      <td className="px-6 py-4 text-right">
                        <code className="bg-black/40 border border-white/10 px-3 py-1 rounded-lg font-mono text-sm text-white">
                          {user.referralCode || "N/A"}
                        </code>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* EMPTY STATE */}
        {leaderboard.length === 0 && (
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
