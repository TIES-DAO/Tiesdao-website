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
// import Collaboration from "./components/Collaboration"; // ❌ optional – keep commented if removed
import DailyStreak from "./components/DailyStreak";

import Quiz from "./components/Quiz";
import QuizLeaderboard from "./components/QuizLeaderboard";
import Referral from "./components/Referral";
import ReferralLeaderboard from "./components/ReferralLeaderboard";

import Login from "./Pages/login";
import Register from "./Pages/signup";
import Dashboard from "./Pages/Dashboard";
import SuperDashboard from "./Pages/SuperDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔁 Redirect /?ref=CODE → /register?ref=CODE
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");

    if (location.pathname === "/" && ref) {
      navigate(`/register?ref=${ref}`, { replace: true });
    }
  }, [location, navigate]);

  // Hide navbar on auth pages
  const hideNavbarRoutes = ["/login", "/register"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* PUBLIC HOME */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Features />
              <DailyStreak />
              <Roadmap />
              <Team />
              {/* <Collaboration /> */} {/* removed safely */}
              <Community />
              <Contact />
              <Footer />
            </>
          }
        />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* QUIZ */}
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

        {/* REFERRALS */}
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

        {/* ADMIN */}
        <Route path="/admin" element={<SuperDashboard />} />
      </Routes>
    </>
  );
}
