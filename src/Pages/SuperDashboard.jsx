import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LogOut,
  Users,
  BookOpen,
  BarChart3,
  Trash2,
  Plus,
  Eye,
  Lock,
  TrendingUp,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api/admin";

export default function SuperDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken")
  );

  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [showAddQuiz, setShowAddQuiz] = useState(false);

  /* =======================
     AUTO LOGIN (TOKEN)
  ======================= */
  useEffect(() => {
    if (adminToken) {
      setAuthenticated(true);
      fetchStats();
    }
  }, [adminToken]);

  /* =======================
     LOGIN
  ======================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) throw new Error("Invalid admin password");

      const data = await res.json();
      localStorage.setItem("adminToken", data.token);
      setAdminToken(data.token);
      setAuthenticated(true);
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  /* =======================
     FETCH STATS
  ======================= */
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  /* =======================
     USERS
  ======================= */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setUsers(await res.json());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleViewUser = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setUserDetails(await res.json());
      setSelectedUser(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;

    await fetch(`${API_BASE}/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  /* =======================
     QUIZZES
  ======================= */
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/quizzes`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setQuizzes(await res.json());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDeleteQuiz = async (id) => {
    if (!confirm("Delete this quiz?")) return;

    await fetch(`${API_BASE}/quizzes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    setQuizzes((prev) => prev.filter((q) => q._id !== id));
  };

  /* =======================
     LOGOUT
  ======================= */
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setAuthenticated(false);
    setAdminToken(null);
    setStats(null);
    setUsers([]);
    setQuizzes([]);
  };

  /* =======================
     LOGIN SCREEN
  ======================= */
  if (!authenticated) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md"
        >
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
            <Lock className="text-red-600" /> Admin Login
          </h1>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full px-4 py-3 border rounded mb-4"
          />

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <button className="w-full bg-red-600 text-white py-3 rounded font-semibold">
            Login
          </button>
        </motion.form>
      </section>
    );
  }

  /* =======================
     DASHBOARD
  ======================= */
  return (
    <section className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <BarChart3 /> Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded flex items-center gap-2"
          >
            <LogOut /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {["stats", "users", "quizzes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded font-semibold ${
                activeTab === tab
                  ? "bg-red-600 text-white"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* STATS */}
        {activeTab === "stats" && stats && (
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard title="Users" value={stats.totalUsers} icon={<Users />} />
            <StatCard title="Quizzes" value={stats.totalQuizzes} icon={<BookOpen />} />
            <StatCard
              title="Attempts"
              value={stats.totalAttempts}
              icon={<TrendingUp />}
            />
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <>
            <button
              onClick={fetchUsers}
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Refresh Users
            </button>

            {!selectedUser ? (
              users.map((u) => (
                <div
                  key={u._id}
                  className="bg-white dark:bg-gray-800 p-4 rounded mb-3 flex justify-between"
                >
                  <div>
                    <p className="font-bold">{u.username}</p>
                    <p className="text-sm">{u.email}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleViewUser(u._id)}>
                      <Eye />
                    </button>
                    <button onClick={() => handleDeleteUser(u._id)}>
                      <Trash2 className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <button onClick={() => setSelectedUser(null)}>⬅ Back</button>
            )}
          </>
        )}

        {/* QUIZZES */}
        {activeTab === "quizzes" && (
          <>
            <div className="flex gap-3 mb-4">
              <button
                onClick={fetchQuizzes}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Refresh Quizzes
              </button>
              <button
                onClick={() => setShowAddQuiz(!showAddQuiz)}
                className="bg-green-600 text-white px-4 py-2 rounded flex gap-2"
              >
                <Plus /> Add Quiz
              </button>
            </div>

            {quizzes.map((q) => (
              <div
                key={q._id}
                className="bg-white dark:bg-gray-800 p-4 rounded mb-3 flex justify-between"
              >
                <p className="font-bold">{q.title}</p>
                <button onClick={() => handleDeleteQuiz(q._id)}>
                  <Trash2 className="text-red-600" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}

/* =======================
   STAT CARD
======================= */
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex justify-between">
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-4xl font-bold">{value || 0}</p>
      </div>
      <div className="opacity-50">{icon}</div>
    </div>
  );
}
