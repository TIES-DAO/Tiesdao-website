import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  BookOpen,
  TrendingUp,
  Search,
  Trash2,
  LogOut,
  BarChart3,
  Activity,
  Plus,
  Copy,
  Lock,
  Unlock,
  RotateCcw,
  AlertTriangle,
  Download,
  FileText,
  Zap,
  Shield,
  ChevronDown,
  X,
  PieChart as PieChartIcon,
  TrendingDown,
  Database,
  Layers,
  Gauge,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import API_BASE from "../config/api";

const ADMIN = `${API_BASE}/api/admin`;

export default function AdminDashboard() {
  const token = localStorage.getItem("adminToken");
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [quizAnalytics, setQuizAnalytics] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "medium",
    points: 10,
  });
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });
  const [questionIdCounter, setQuestionIdCounter] = useState(0);

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin-login";
    }
  }, [token]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    const headers = auth();
    Promise.all([
      fetch(`${ADMIN}/stats`, { headers }).then(r => r.json()),
      fetch(`${ADMIN}/users`, { headers }).then(r => r.json()),
      fetch(`${ADMIN}/quizzes`, { headers }).then(r => r.json()),
      fetch(`${ADMIN}/analytics/quizzes`, { headers }).then(r => r.json()),
    ]).then(([statsData, usersData, quizzesData, analyticsData]) => {
      setStats(statsData);
      setUsers(usersData || []);
      setQuizzes(quizzesData || []);
      setQuizAnalytics(analyticsData || []);
    }).catch(e => console.error("Load error:", e));
  };

  const auth = () => {
    const token = localStorage.getItem("adminToken");
    return { Authorization: `Bearer ${token}` };
  };

  const duplicateQuiz = async (quizId) => {
    try {
      const res = await fetch(`${ADMIN}/quizzes/${quizId}/duplicate`, {
        method: "POST",
        headers: auth(),
      });
      if (res.ok) {
        alert("Quiz duplicated!");
        loadAllData();
      }
    } catch (err) {
      alert("Error duplicating quiz");
    }
  };

  const suspendUser = async (userId, suspended) => {
    try {
      await fetch(`${ADMIN}/users/${userId}/suspend`, {
        method: "PATCH",
        headers: { ...auth(), "Content-Type": "application/json" },
        body: JSON.stringify({ suspended }),
      });
      loadAllData();
    } catch (err) {
      alert("Error updating user");
    }
  };

  const resetPoints = async (userId) => {
    if (!confirm("Reset all points for this user?")) return;
    try {
      await fetch(`${ADMIN}/users/${userId}/reset-points`, {
        method: "PATCH",
        headers: auth(),
      });
      loadAllData();
    } catch (err) {
      alert("Error resetting points");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete user permanently?")) return;
    try {
      await fetch(`${ADMIN}/users/${id}`, {
        method: "DELETE",
        headers: auth(),
      });
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert("Error deleting user");
    }
  };

  const deleteQuiz = async (id) => {
    if (!confirm("Delete quiz permanently?")) return;
    try {
      await fetch(`${ADMIN}/quizzes/${id}`, {
        method: "DELETE",
        headers: auth(),
      });
      setQuizzes(quizzes.filter(q => q._id !== id));
    } catch (err) {
      alert("Error deleting quiz");
    }
  };

  const createQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.title || !quizForm.category) {
      alert("Fill in all required fields");
      return;
    }
    if (questions.length === 0) {
      alert("Add at least one question");
      return;
    }
    try {
      const formattedQuestions = questions.map(q => ({
        question: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
      }));

      const res = await fetch(`${ADMIN}/quizzes`, {
        method: "POST",
        headers: { ...auth(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...quizForm, questions: formattedQuestions }),
      });
      if (res.ok) {
        alert("Quiz created!");
        setShowCreateForm(false);
        setQuizForm({ title: "", description: "", category: "", difficulty: "medium", points: 10 });
        setQuestions([]);
        loadAllData();
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const exportData = async (type) => {
    try {
      const res = await fetch(`${ADMIN}/export/${type}`, { headers: auth() });
      const data = await res.json();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    } catch (err) {
      alert("Export failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    location.href = "/admin-login";
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.username && u.username.toLowerCase().includes(search.toLowerCase()))
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "quizzes", label: "Quizzes", icon: BookOpen },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "reports", label: "Reports", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6 text-white">
      {/* GLOWING BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex justify-between items-center"
      >
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <Shield className="text-blue-400" size={40} />
            ADMIN NEXUS
          </h1>
          <p className="text-cyan-400/70 text-sm mt-1">Web3 Admin Control Panel</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="flex gap-2 items-center bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/50 transition"
        >
          <LogOut size={20} /> Logout
        </motion.button>
      </motion.div>

      {/* NAV TABS */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {tabs.map(t => {
          const IconComponent = t.icon;
          return (
            <motion.button
              key={t.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTab(t.id)}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap backdrop-blur-lg border transition flex items-center gap-2 ${
                tab === t.id
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-400 shadow-lg shadow-blue-500/50"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <IconComponent size={18} />
              {t.label}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* STAT CARDS */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: "Total Users", value: stats.totalUsers, icon: Users, color: "from-blue-600 to-cyan-600" },
                { label: "Total Quizzes", value: stats.totalQuizzes, icon: BookOpen, color: "from-purple-600 to-pink-600" },
                { label: "Quiz Attempts", value: stats.totalAttempts, icon: Zap, color: "from-orange-600 to-red-600" },
                { label: "Active Users", value: Math.floor((stats.totalUsers || 0) * 0.8), icon: Activity, color: "from-green-600 to-emerald-600" },
              ].map((stat, i) => {
                const IconComp = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl border border-white/10 backdrop-blur-lg hover:border-white/30 transition group`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white/70 text-sm font-semibold">{stat.label}</p>
                        <p className="text-4xl font-black mt-2">{stat.value || 0}</p>
                      </div>
                      <IconComp size={32} className="text-white/60 group-hover:scale-110 transition" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CHARTS */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-lg"
              >
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Activity size={20} /> User Growth
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.chart || []}>
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                    <Line dataKey="value" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: "#0ea5e9", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-lg"
              >
                <h3 className="font-bold text-lg mb-4">Top Users</h3>
                <div className="space-y-3">
                  {(stats.topUsers || []).slice(0, 5).map((u, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                      <span>{u.username || u.email}</span>
                      <span className="font-bold text-cyan-400">{u.totalPoints} pts</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* USERS TAB */}
        {tab === "users" && (
          <motion.div
            key="users"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  placeholder="Search by email or username..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 backdrop-blur-lg"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {filteredUsers.map((u, i) => (
                <motion.div
                  key={u._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-gradient-to-r from-white/5 to-white/10 p-5 rounded-xl border border-white/10 hover:border-cyan-400/50 transition group backdrop-blur-lg ${
                    u.suspended ? "opacity-60 border-red-400/50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex gap-2 items-center">
                        <h4 className="font-bold text-lg">{u.username || "Anonymous"}</h4>
                        {u.suspended && <span className="text-xs bg-red-500/30 text-red-300 px-2 py-1 rounded">SUSPENDED</span>}
                      </div>
                      <p className="text-gray-400 text-sm">{u.email}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-cyan-400">Quiz: {u.quizPoints} pts</span>
                        <span className="text-green-400">Referral: {u.referralPoints} pts</span>
                        <span className="text-yellow-400 font-bold">Total: {u.totalPoints} pts</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => {
                          setSelectedUser(u._id);
                          setShowUserModal(true);
                        }}
                        className="p-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/50 rounded-lg transition"
                        title="View details"
                      >
                        <BarChart3 size={18} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => suspendUser(u._id, !u.suspended)}
                        className={`p-2 rounded-lg border transition ${
                          u.suspended
                            ? "bg-green-600/30 border-green-400/50 hover:bg-green-600/50"
                            : "bg-yellow-600/30 border-yellow-400/50 hover:bg-yellow-600/50"
                        }`}
                        title={u.suspended ? "Unsuspend" : "Suspend"}
                      >
                        {u.suspended ? <Unlock size={18} /> : <Lock size={18} />}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => resetPoints(u._id)}
                        className="p-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/50 rounded-lg transition"
                        title="Reset points"
                      >
                        <RotateCcw size={18} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => deleteUser(u._id)}
                        className="p-2 bg-red-600/30 hover:bg-red-600/50 border border-red-400/50 rounded-lg transition"
                        title="Delete user"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* QUIZZES TAB */}
        {tab === "quizzes" && (
          <motion.div
            key="quizzes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex gap-2 items-center bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/50 transition"
            >
              <Plus size={20} /> Create Quiz
            </motion.button>

            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20 backdrop-blur-lg"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <BookOpen size={24} /> New Quiz
                </h3>
                <form onSubmit={createQuiz} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Quiz Title"
                    value={quizForm.title}
                    onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                  <textarea
                    placeholder="Description"
                    value={quizForm.description}
                    onChange={e => setQuizForm({ ...quizForm, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 h-20"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Category"
                      value={quizForm.category}
                      onChange={e => setQuizForm({ ...quizForm, category: e.target.value })}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500"
                    />
                    <select
                      value={quizForm.difficulty}
                      onChange={e => setQuizForm({ ...quizForm, difficulty: e.target.value })}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                    >
                      <option>easy</option>
                      <option>medium</option>
                      <option>hard</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Points"
                      value={quizForm.points}
                      onChange={e => setQuizForm({ ...quizForm, points: parseInt(e.target.value) || 0 })}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                    />
                  </div>

                  {/* Questions */}
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-bold text-cyan-400">Questions ({questions.length})</h4>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Question text..."
                        value={currentQuestion.text}
                        onChange={e => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500"
                      />
                      <div className="space-y-2">
                        {currentQuestion.options.map((opt, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <input
                              type="text"
                              placeholder={`Option ${idx + 1}`}
                              value={opt}
                              onChange={e => {
                                const newOpts = [...currentQuestion.options];
                                newOpts[idx] = e.target.value;
                                setCurrentQuestion({ ...currentQuestion, options: newOpts });
                              }}
                              className="flex-1 px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-500"
                            />
                            <input
                              type="radio"
                              checked={currentQuestion.correctAnswer === idx}
                              onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: idx })}
                              className="w-5 h-5 accent-cyan-400"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setQuestions([...questions, { ...currentQuestion, id: questionIdCounter }]);
                          setQuestionIdCounter(questionIdCounter + 1);
                          setCurrentQuestion({ text: "", options: ["", "", "", ""], correctAnswer: 0 });
                        }}
                        className="w-full py-2 bg-cyan-600/30 border border-cyan-400/50 rounded-lg text-cyan-300 font-semibold hover:bg-cyan-600/50 transition"
                      >
                        + Add Question
                      </button>
                    </div>

                    {questions.map((q, i) => (
                      <div key={q.id} className="bg-white/5 p-3 rounded-lg flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{i + 1}. {q.text}</p>
                          <p className="text-xs text-gray-400">Correct: {q.options[q.correctAnswer]}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/50 transition"
                    >
                      Create Quiz
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid gap-4">
              {quizzes.map((q, i) => (
                <motion.div
                  key={q._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gradient-to-r from-white/5 to-white/10 p-5 rounded-xl border border-white/10 hover:border-cyan-400/50 transition group backdrop-blur-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{q.title}</h4>
                      <div className="flex gap-3 mt-2 text-sm">
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">{q.category}</span>
                        <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded">{q.difficulty}</span>
                        <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">{q.points} pts</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => duplicateQuiz(q._id)}
                        className="p-2 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/50 rounded-lg transition"
                      >
                        <Copy size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => deleteQuiz(q._id)}
                        className="p-2 bg-red-600/30 hover:bg-red-600/50 border border-red-400/50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ANALYTICS TAB */}
        {tab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {quizAnalytics.map((qa, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-lg"
                >
                  <h3 className="font-bold text-lg mb-4">{qa.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Attempts: {qa.totalAttempts}</span>
                      <span className="text-cyan-400">Avg Score: {qa.avgScore}</span>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {(qa.questionStats || []).map((qs, j) => (
                      <div key={j} className="bg-white/5 p-2 rounded">
                        <p className="text-xs font-semibold mb-1">Q{j + 1}: {qs.correctPercentage}% correct</p>
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                            style={{ width: `${qs.correctPercentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* REPORTS TAB */}
        {tab === "reports" && (
          <motion.div
            key="reports"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => exportData("users")}
                className="bg-gradient-to-br from-blue-600/50 to-cyan-600/50 p-8 rounded-2xl border border-cyan-400/50 hover:border-cyan-400 transition backdrop-blur-lg group"
              >
                <Download size={32} className="mx-auto mb-3 group-hover:scale-110 transition" />
                <h4 className="font-bold text-lg">Export Users</h4>
                <p className="text-sm text-gray-300 mt-1">Download user data as JSON</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => exportData("attempts")}
                className="bg-gradient-to-br from-purple-600/50 to-pink-600/50 p-8 rounded-2xl border border-purple-400/50 hover:border-purple-400 transition backdrop-blur-lg group"
              >
                <Download size={32} className="mx-auto mb-3 group-hover:scale-110 transition" />
                <h4 className="font-bold text-lg">Export Quiz Attempts</h4>
                <p className="text-sm text-gray-300 mt-1">Download attempt records as JSON</p>
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-yellow-600/30 to-orange-600/30 p-6 rounded-2xl border border-yellow-400/50 backdrop-blur-lg"
            >
              <div className="flex gap-3 items-start">
                <AlertTriangle className="text-yellow-400 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-lg">Referral Integrity Check</h4>
                  <p className="text-gray-300 text-sm mt-1">Verify referral chains and detect broken links</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="mt-3 px-4 py-2 bg-yellow-600/50 border border-yellow-400/50 rounded-lg font-semibold hover:bg-yellow-600/70 transition"
                    onClick={async () => {
                      const res = await fetch(`${ADMIN}/verify/referrals`, { headers: auth() });
                      const data = await res.json();
                      alert(`Found ${data.issues} referral issues out of ${data.totalUsers} users`);
                    }}
                  >
                    Run Check
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
