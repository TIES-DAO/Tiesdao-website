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
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import API_BASE from "../config/api";

const ADMIN = `${API_BASE}/api/admin`;

export default function SuperDashboard() {
  const token = localStorage.getItem("adminToken");

  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
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

  // Check if token exists on load
  useEffect(() => {
    if (!token) {
      console.error("No admin token found");
      localStorage.removeItem("adminToken");
      window.location.href = "/admin-login";
    }
  }, [token]);

  useEffect(() => {
    const headers = auth();
    
    fetch(`${ADMIN}/stats`, { headers })
      .then((r) => {
        if (!r.ok) throw new Error(`Stats: ${r.status}`);
        return r.json();
      })
      .then(setStats)
      .catch((e) => console.error("Stats error:", e));

    fetch(`${ADMIN}/users`, { headers })
      .then((r) => {
        if (!r.ok) throw new Error(`Users: ${r.status}`);
        return r.json();
      })
      .then(setUsers)
      .catch((e) => console.error("Users error:", e));

    fetch(`${ADMIN}/quizzes`, { headers })
      .then((r) => {
        if (!r.ok) throw new Error(`Quizzes: ${r.status}`);
        return r.json();
      })
      .then(setQuizzes)
      .catch((e) => console.error("Quizzes error:", e));
  }, []);

  const deleteUser = async (id) => {
    if (!confirm("Delete user?")) return;
    await fetch(`${ADMIN}/users/${id}`, {
      method: "DELETE",
      headers: auth(),
    });
    setUsers(users.filter((u) => u._id !== id));
  };

  const deleteQuiz = async (id) => {
    if (!confirm("Delete quiz?")) return;
    await fetch(`${ADMIN}/quizzes/${id}`, {
      method: "DELETE",
      headers: auth(),
    });
    setQuizzes(quizzes.filter((q) => q._id !== id));
  };

  const createQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.title || !quizForm.category) {
      alert("Please fill in title and category");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }
    try {
      // Convert questions format: text -> question
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
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Server error: ${res.status}`);
      }
      const newQuiz = await res.json();
      setQuizzes([...quizzes, newQuiz]);
      setQuizForm({ title: "", description: "", category: "", difficulty: "medium", points: 10 });
      setQuestions([]);
      setCurrentQuestion({ text: "", options: ["", "", "", ""], correctAnswer: 0 });
      setShowCreateForm(false);
      alert("Quiz created successfully!");
    } catch (err) {
      console.error("Create quiz error:", err);
      alert(`Error creating quiz: ${err.message}`);
    }
  };

  const addQuestion = () => {
    if (!currentQuestion.text || currentQuestion.options.some(o => !o)) {
      alert("Fill in question text and all options");
      return;
    }
    const questionWithId = { ...currentQuestion, id: questionIdCounter };
    setQuestions([...questions, questionWithId]);
    setQuestionIdCounter(questionIdCounter + 1);
    setCurrentQuestion({ text: "", options: ["", "", "", ""], correctAnswer: 0 });
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    location.href = "/admin-login";
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 p-8 text-white">
      {/* HEADER */}
      <div className="flex justify-between mb-10 items-center">
        <h1 className="text-4xl font-black flex gap-3">
          <BarChart3 /> Admin Dashboard
        </h1>
      </div>

      {/* TABS & LOGOUT */}
      <div className="flex gap-4 mb-8 flex-wrap justify-between items-center">
        <div className="flex gap-4 flex-wrap">
          {["overview", "users", "quizzes"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-xl font-bold ${
                tab === t
                  ? "bg-red-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        <button onClick={logout} className="flex gap-2 items-center bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl font-bold text-white transition cursor-pointer whitespace-nowrap">
          <LogOut size={20} /> Logout
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* OVERVIEW */}
        {tab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <Stat icon={<Users />} label="Users" value={stats.totalUsers} />
            <Stat icon={<BookOpen />} label="Quizzes" value={stats.totalQuizzes} />
            <Stat icon={<TrendingUp />} label="Attempts" value={stats.totalAttempts} />

            <div className="md:col-span-3 bg-gray-800/70 rounded-2xl p-6">
              <h2 className="mb-4 font-bold flex gap-2">
                <Activity /> Growth
              </h2>
              {/* Optionally, you can add a chart here if your backend provides chart data */}
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats.chart || []}>
                  <XAxis dataKey="date" />
                  <Tooltip />
                  <Line dataKey="value" stroke="#ef4444" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* USERS */}
        {tab === "users" && (
          <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-3 mb-4">
              <Search />
              <input
                placeholder="Search users..."
                className="bg-gray-800 px-4 py-2 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {filteredUsers.map((u) => (
              <Row key={u._id}>
                <div>
                  <p className="font-bold">{u.username}</p>
                  <p className="text-sm text-gray-400">{u.email}</p>
                </div>
                <Trash2
                  className="text-red-500 cursor-pointer"
                  onClick={() => deleteUser(u._id)}
                />
              </Row>
            ))}
          </motion.div>
        )}

        {/* QUIZZES */}
        {tab === "quizzes" && (
          <motion.div key="quizzes" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="mb-6 flex gap-2 items-center bg-red-600 px-6 py-2 rounded-xl font-bold hover:bg-red-700"
            >
              <Plus size={20} /> Create Quiz
            </button>

            {showCreateForm && (
              <div className="bg-gray-800/70 rounded-2xl p-6 mb-6">
                <h3 className="text-2xl font-bold mb-4">Create New Quiz</h3>
                <form onSubmit={createQuiz} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Quiz Title"
                    className="w-full bg-gray-700 px-4 py-2 rounded-xl text-white"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  />
                  <textarea
                    placeholder="Description"
                    className="w-full bg-gray-700 px-4 py-2 rounded-xl text-white"
                    value={quizForm.description}
                    onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    className="w-full bg-gray-700 px-4 py-2 rounded-xl text-white"
                    value={quizForm.category}
                    onChange={(e) => setQuizForm({ ...quizForm, category: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      className="bg-gray-700 px-4 py-2 rounded-xl text-white"
                      value={quizForm.difficulty}
                      onChange={(e) => setQuizForm({ ...quizForm, difficulty: e.target.value })}
                    >
                      <option>easy</option>
                      <option>medium</option>
                      <option>hard</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Points"
                      className="bg-gray-700 px-4 py-2 rounded-xl text-white"
                      value={quizForm.points}
                      onChange={(e) => setQuizForm({ ...quizForm, points: parseInt(e.target.value) })}
                    />
                  </div>

                  {/* Questions Section */}
                  <div className="bg-gray-900/50 p-4 rounded-xl mt-6">
                    <h4 className="text-lg font-bold mb-4">Questions ({questions.length})</h4>

                    {/* Add Question Form */}
                    <div className="bg-gray-800 p-4 rounded-xl mb-4 space-y-3">
                      <input
                        type="text"
                        placeholder="Question text..."
                        className="w-full bg-gray-700 px-4 py-2 rounded-xl text-white"
                        value={currentQuestion.text}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                      />
                      <div className="space-y-2">
                        {currentQuestion.options.map((option, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              placeholder={`Option ${idx + 1}`}
                              className="flex-1 bg-gray-700 px-4 py-2 rounded-xl text-white"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...currentQuestion.options];
                                newOptions[idx] = e.target.value;
                                setCurrentQuestion({ ...currentQuestion, options: newOptions });
                              }}
                            />
                            <input
                              type="radio"
                              name="correct"
                              checked={currentQuestion.correctAnswer === idx}
                              onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: idx })}
                              className="w-5"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="w-full bg-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-700"
                      >
                        Add Question
                      </button>
                    </div>

                    {/* Display Added Questions */}
                    {questions.map((q) => (
                      <div key={q.id} className="bg-gray-700 p-3 rounded-xl mb-2 flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold text-sm">{questions.indexOf(q) + 1}. {q.text}</p>
                          <p className="text-xs text-gray-300">Correct: {q.options[q.correctAnswer]}</p>
                        </div>
                        <Trash2
                          className="text-red-500 cursor-pointer mt-1"
                          onClick={() => removeQuestion(q.id)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 px-6 py-2 rounded-xl font-bold hover:bg-green-700">
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="bg-gray-600 px-6 py-2 rounded-xl font-bold hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {quizzes.map((quiz) => (
              <Row key={quiz._id}>
                <div>
                  <p className="font-bold">{quiz.title}</p>
                  <p className="text-sm text-gray-400">{quiz.category} • {quiz.difficulty} • {quiz.points} pts</p>
                </div>
                <Trash2
                  className="text-red-500 cursor-pointer"
                  onClick={() => deleteQuiz(quiz._id)}
                />
              </Row>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const auth = () => {
  const token = localStorage.getItem("adminToken");
  console.log("Token:", token ? "exists" : "missing");
  return {
    Authorization: `Bearer ${token}`,
  };
};

function Stat({ icon, label, value }) {
  return (
    <div className="bg-gray-800/80 rounded-2xl p-6 flex justify-between items-center">
      <div>
        <p className="text-gray-400">{label}</p>
        <p className="text-4xl font-black">{value || 0}</p>
      </div>
      {icon}
    </div>
  );
}

function Row({ children }) {
  return (
    <div className="bg-gray-800/60 rounded-xl p-4 mb-3 flex justify-between items-center">
      {children}
    </div>
  );
}
