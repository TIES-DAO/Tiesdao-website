import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Send, DollarSign, Image, FileText, TrendingUp, Smartphone, BookOpen, Users, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../config/api";

export default function Web3Education() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !email.trim()) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          message: `Web3 Question: ${question}`,
        }),
      });
      const data = await res.json();
      setMessage(data.message);
      setQuestion("");
    } catch (err) {
      console.error("Question submit error:", err);
      setMessage("Failed to send question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl bg-white dark:bg-gray-900 p-8 shadow-xl border border-gray-100 dark:border-gray-800"
    >
      <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <Globe size={26} />
      </div>

      <h3 className="mt-6 text-2xl font-extrabold">What is Web3?</h3>
      <p className="text-sm text-gray-500 mt-1">
        The Future of the Internet: Decentralized, User-Owned, and Empowering
      </p>

      <div className="mt-6 text-sm text-gray-600 dark:text-gray-300 space-y-4">
        <p>
          <strong>What is Web3 in simple terms?</strong> Think of the internet as a big library. In the old days (Web1), you could only read books. Then came Web2, where you could write reviews and share with friends, but the library owns all the books and can throw you out anytime. Web3 is like having your own bookshelf – you own your books, you decide who can read them, and no one can take them away.
        </p>

        <p>
          <strong>Why should you care?</strong> Right now, when you post photos on social media or store files online, big companies control them. They can delete your account, change their rules, or even sell your data. Web3 gives you back control using something called "blockchain" – a super secure, shared notebook that everyone can see but no one can cheat.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start gap-3">
          <Shield className="text-blue-600 mt-1 flex-shrink-0" size={20} />
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-200">Real-World Analogy:</p>
            <p>Traditional banking is like keeping your money in a bank's safe. The bank controls the safe and can lock you out. Web3 is like having your own safe with a magical lock that only you can open, and everyone can see that the safe exists, but only you have the key.</p>
          </div>
        </div>

        <p>
          <strong>Key Web3 Concepts Explained:</strong>
        </p>
        <div className="space-y-3">
          <div className="border-l-4 border-purple-500 pl-3 flex items-start gap-3">
            <DollarSign className="text-purple-600 mt-1 flex-shrink-0" size={18} />
            <div>
              <p className="font-semibold">Cryptocurrencies</p>
              <p>Digital money that works like cash but online. No banks needed! Bitcoin was the first. You can send it to anyone, anywhere, instantly. Think of it as email for money.</p>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-3 flex items-start gap-3">
            <Image className="text-green-600 mt-1 flex-shrink-0" size={18} />
            <div>
              <p className="font-semibold">NFTs (Non-Fungible Tokens)</p>
              <p>Unique digital certificates of ownership. Like a deed to a house, but for digital art, music, or even tweets. "Non-fungible" means each one is unique – you can't swap one NFT for another like you can swap dollar bills.</p>
            </div>
          </div>

          <div className="border-l-4 border-orange-500 pl-3 flex items-start gap-3">
            <FileText className="text-orange-600 mt-1 flex-shrink-0" size={18} />
            <div>
              <p className="font-semibold">Smart Contracts</p>
              <p>Computer programs that automatically follow rules. Like a vending machine: put in money, get your snack. No human needed! They can handle payments, agreements, or even run entire businesses.</p>
            </div>
          </div>

          <div className="border-l-4 border-red-500 pl-3 flex items-start gap-3">
            <TrendingUp className="text-red-600 mt-1 flex-shrink-0" size={18} />
            <div>
              <p className="font-semibold">DeFi (Decentralized Finance)</p>
              <p>Banking without banks. Lend money and earn interest, borrow without credit checks, or exchange currencies – all through apps on your phone, no bank account required.</p>
            </div>
          </div>

          <div className="border-l-4 border-indigo-500 pl-3 flex items-start gap-3">
            <Smartphone className="text-indigo-600 mt-1 flex-shrink-0" size={18} />
            <div>
              <p className="font-semibold">dApps (Decentralized Apps)</p>
              <p>Apps that run on blockchain instead of company servers. They're like regular apps, but you control your data, and they're harder to shut down or censor.</p>
            </div>
          </div>
        </div>

        <p>
          <strong>Getting Started with Web3:</strong> Don't worry if this seems overwhelming! Start small: download a crypto wallet (like a digital wallet for your money), try buying a small amount of cryptocurrency, or explore NFT marketplaces. Remember, Web3 is about learning and experimenting – it's okay to start slow.
        </p>

        <p>
          <strong>The Big Picture:</strong> Web3 isn't just about making money or collecting digital art. It's about creating a more fair and open internet where individuals have power, not just big companies. It's the foundation for the next era of digital freedom.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        {!user && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
              required
            />
          </div>
        )}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ask a Question
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What's confusing about Web3? Ask us anything!"
          className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm resize-none"
          rows={3}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send size={16} />
          {loading ? "Sending..." : "Send Question"}
        </button>
      </form>

      {message && (
        <p className="mt-3 text-sm text-center text-green-600">{message}</p>
      )}
    </motion.div>
  );
}