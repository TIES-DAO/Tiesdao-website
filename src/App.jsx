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

import Login from "./Pages/login";
import Register from "./Pages/signup";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* AUTH ROUTES (public) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ALL OTHER ROUTES PROTECTED */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}



