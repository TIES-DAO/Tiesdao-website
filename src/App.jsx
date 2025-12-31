import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Roadmap from "./components/Roadmap";
import Contact from "./components/Contact";
import Community from "./components/Community";
import Footer from "./components/Footer";
import Team from "./components/Team";
import Collaboration from "./components/Collaboration";
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
              <Collaboration />
              <Community />
              <Contact />
              <Footer />
            </>
          }
        />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* QUIZ ROUTES */}
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

        {/* REFERRAL ROUTES */}
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

        {/* SUPER ADMIN DASHBOARD */}
        <Route path="/admin" element={<SuperDashboard />} />
      </Routes>
    </>
  );
}
