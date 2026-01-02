import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../config/api";

export default function Quiz() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/quiz`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      // Ensure each quiz has questions array
      const validQuizzes = Array.isArray(data) 
        ? data.map(q => ({ ...q, questions: q.questions || [] }))
        : [];
      setQuizzes(validQuizzes);
    } catch (err) {
      console.error("Quiz fetch error:", err);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (quiz) => {
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      alert("Quiz has no questions");
      return;
    }
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers(Array(quiz.questions.length).fill(null));
    setResult(null);
  };

  const handleAnswerSelect = (idx) => {
    const updated = [...answers];
    updated[currentQuestion] = idx;
    setAnswers(updated);
  };

  const handleSubmitQuiz = async () => {
    if (answers.some((a) => a === null)) return alert("Answer all questions");

    try {
      setSubmitting(true);
      const res = await fetch(
        `${API_BASE}/api/quiz/${selectedQuiz._id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ answers }),
        }
      );
      const data = await res.json();
      setResult(data);
    } finally {
      setSubmitting(false);
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

  /* ---------------- RESULT ---------------- */
  if (result) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-black px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center"
        >
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white">Quiz Completed</h2>
          <p className="text-5xl font-black text-blue-500 my-4">
            {result.score}/{result.totalQuestions}
          </p>
          <p className="text-gray-300">{result.message}</p>

          <div className="mt-6 text-green-400 font-bold text-xl">
            +{Math.round(result.pointsEarned)} Points
          </div>

          <button
            onClick={() => {
              setSelectedQuiz(null);
              setResult(null);
            }}
            className="mt-8 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white transition"
          >
            Back to Quizzes
          </button>
        </motion.div>
      </section>
    );
  }

  /* ---------------- QUIZ PLAY ---------------- */
  if (selectedQuiz) {
    const q = selectedQuiz.questions[currentQuestion];
    const progress =
      ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;

    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-950 to-black px-4 py-12 pt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Target className="text-blue-400" />
                Question {currentQuestion + 1} /{" "}
                {selectedQuiz.questions.length}
              </h3>
              <span className="text-sm text-gray-400">
                {progress.toFixed(0)}%
              </span>
            </div>

            {/* PROGRESS */}
            <div className="h-2 rounded-full bg-white/10 mb-8">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
              />
            </div>

            {/* QUESTION */}
            <h2 className="text-2xl font-bold text-white mb-6">
              {q.question}
            </h2>

            {/* OPTIONS */}
            <div className="space-y-4">
              {q.options.map((opt, idx) => {
                const selected = answers[currentQuestion] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition
                      ${
                        selected
                          ? "border-blue-500 bg-blue-500/20 text-white"
                          : "border-white/10 hover:border-blue-400 text-gray-300"
                      }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between mt-8">
              <button
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion((p) => p - 1)}
                className="px-6 py-2 rounded-xl bg-white/10 text-white disabled:opacity-30"
              >
                Back
              </button>

              {currentQuestion === selectedQuiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 font-bold text-white flex items-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion((p) => p + 1)}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white"
                >
                  Next
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  /* ---------------- QUIZ LIST ---------------- */
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 to-black px-4 py-12 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Sparkles className="text-blue-500" />
          <h1 className="text-4xl font-black text-white">Quizzes</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <motion.div
              key={quiz._id}
              whileHover={{ y: -6 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                  {quiz.category}
                </span>
                <Award className="text-yellow-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {quiz.title}
              </h3>

              <p className="text-gray-400 mb-4">{quiz.description}</p>

              <div className="flex justify-between text-sm text-gray-400 mb-6">
                <span className="flex items-center gap-1">
                  <BookOpen size={14} /> {quiz.questions.length}
                </span>
                <span className="flex items-center gap-1 text-green-400 font-bold">
                  <Award size={14} /> {quiz.points} pts
                </span>
              </div>

              <button
                onClick={() => handleStartQuiz(quiz)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 font-bold text-white flex items-center justify-center gap-2"
              >
                Start Quiz <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
