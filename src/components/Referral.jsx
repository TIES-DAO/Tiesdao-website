import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  Copy,
  CheckCircle2,
  Users,
  Info,
  Loader2,
  Sparkles,
  Link2,
  UserCheck,
  UserX,
  Calendar,
} from "lucide-react";
import API_BASE from "../config/api";

export default function Referral() {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralInfo();
  }, []);

  const fetchReferralInfo = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/referral/info`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setReferralData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/referral/generate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setReferralData((prev) => ({
        ...prev,
        referralCode: data.referralCode,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = async () => {
    if (!referralData?.referralCode) return;
    await navigator.clipboard.writeText(
      `${window.location.origin}?ref=${referralData.referralCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <Share2 className="text-black" size={26} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white">
              Referral Program
            </h1>
            <p className="text-gray-400 text-sm">
              Invite friends. Earn points. Climb the ranks.
            </p>
          </div>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">

          {/* REFERRAL CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Link2 size={20} className="text-green-400" />
              Your Referral Link
            </h3>

            {referralData?.referralCode ? (
              <>
                <div className="rounded-xl bg-black/40 border border-white/10 p-4 mb-4">
                  <code className="block text-center text-2xl font-mono font-black text-green-400">
                    {referralData.referralCode}
                  </code>
                </div>

                <p className="text-sm text-gray-400 mb-6">
                  Share this link and earn rewards for every signup.
                </p>

                <button
                  onClick={handleCopy}
                  className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2
                    ${
                      copied
                        ? "bg-green-600 text-black"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-black"
                    }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={18} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={18} /> Copy Referral Link
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-400 mb-6">
                  Generate your unique referral code to start earning points.
                </p>
                <button
                  onClick={generateReferralCode}
                  className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-600 hover:opacity-90 text-black"
                >
                  Generate Referral Code
                </button>
              </>
            )}
          </motion.div>

          {/* STATS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* POINTS */}
            <div className="rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-600/10 border border-green-500/30 p-6">
              <p className="text-sm text-green-300 mb-2 flex items-center gap-2">
                <Sparkles size={14} /> Referral Points
              </p>
              <p className="text-4xl font-black text-white">
                {Math.round(referralData?.referralPoints || 0)}
              </p>
            </div>

            {/* REFERRALS */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-600/10 border border-blue-500/30 p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300 mb-2">Active Referrals</p>
                <p className="text-4xl font-black text-white">
                  {referralData?.referralCount || 0}
                </p>
              </div>
              <Users size={44} className="text-blue-400 opacity-70" />
            </div>
          </motion.div>
        </div>

        {/* REFERRED USERS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Users size={20} className="text-purple-400" />
            Your Referrals ({referralData?.referredUsers?.length || 0})
          </h3>

          {referralData?.referredUsers && referralData.referredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Joined</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Points</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Quizzes</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {referralData.referredUsers.map((user, index) => (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                            {(user.username || user.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {user.username || user.email.split('@')[0]}
                            </p>
                            <p className="text-gray-400 text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-500" />
                          {new Date(user.joinedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-green-400 font-medium">
                        {user.totalPoints}
                      </td>
                      <td className="py-4 px-4 text-blue-400 font-medium">
                        {user.quizzesCompleted}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {user.isActive ? (
                            <>
                              <UserCheck size={16} className="text-green-400" />
                              <span className="text-green-400 text-sm">Active</span>
                            </>
                          ) : (
                            <>
                              <UserX size={16} className="text-gray-500" />
                              <span className="text-gray-500 text-sm">Inactive</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No referrals yet</p>
              <p className="text-gray-500 text-sm">
                Share your referral link to start building your network!
              </p>
            </div>
          )}
        </motion.div>

        {/* INFO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Info size={18} className="text-blue-400" />
            How it works
          </h3>

          <ul className="space-y-3 text-gray-300 text-sm">
            {[
              "Share your referral link with friends",
              "They sign up using your link",
              "You earn 100 referral points",
              "They get 50 bonus points",
              "Points are added instantly",
              "Compete on the referral leaderboard",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-400" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
