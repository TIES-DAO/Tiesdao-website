import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Roadmap from "./components/Roadmap";
import Contact from "./components/Contact";
import Community from "./components/Community";
import Footer from "./components/Footer";
import Team from "./components/Team";
import Collaboration from "./components/Collaboration";
import { ThemeProvider } from "./context/ThemeContext";
import DailyStreak from "./components/DailyStreak";

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <Hero />

      {/* Daily Check-in Card */}

      <Features />
      <DailyStreak />
      <Roadmap />
      <Team />
      <Collaboration />
      <Community />
      <Contact />
      <Footer />
    </ThemeProvider>
  );
}
