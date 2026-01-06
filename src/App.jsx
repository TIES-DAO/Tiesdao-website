import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Roadmap from "./components/Roadmap";
import Contact from "./components/Contact";
import Community from "./components/Community";
import Footer from "./components/Footer";
import Team from "./components/Team";
import Web3Education from "./components/Web3Education";
import Feedback from "./components/Feedback";

import Quiz from "./components/Quiz";
import QuizLeaderboard from "./components/QuizLeaderboard";
import Referral from "./components/Referral";
import ReferralLeaderboard from "./components/ReferralLeaderboard";

import Login from "./Pages/login";
import Register from "./Pages/signup";
import ForgotPassword from "./Pages/ForgotPassword";
import Dashboard from "./Pages/Dashboard";

/* 🔐 ADMIN */
import AdminDashboard from "./Pages/AdminDashboard";
import AdminLogin from "./Pages/AdminLogin";
import AdminRoute from "./routes/AdminRoute";

import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  /* 🔁 Referral redirect */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");

    if (location.pathname === "/" && ref) {
      navigate(`/register?ref=${ref}`, { replace: true });
    }
  }, [location, navigate]);

  /* ❌ Hide navbar on auth pages and admin */
  const hideNavbarRoutes = ["/login", "/register", "/forgot-password", "/admin-login", "/admin"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ================= PUBLIC HOME ================= */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Features />
              <section className="py-16 bg-gray-50 dark:bg-gray-950">
                <div className="max-w-4xl mx-auto px-4">
                  <Web3Education />
                </div>
              </section>
              <Roadmap />
              <Team />
              <Community />
              <Feedback />
              <Contact />
              <Footer />
            </>
          }
        />

        {/* ================= AUTH ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ================= USER DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= QUIZ ================= */}
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz-leaderboard"
          element={
            <ProtectedRoute>
              <QuizLeaderboard />
            </ProtectedRoute>
          }
        />

        {/* ================= REFERRALS ================= */}
        <Route
          path="/referral"
          element={
            <ProtectedRoute>
              <Referral />
            </ProtectedRoute>
          }
        />
        <Route
          path="/referral-leaderboard"
          element={
            <ProtectedRoute>
              <ReferralLeaderboard />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>

      <Feedback />
    </>
  );
}
