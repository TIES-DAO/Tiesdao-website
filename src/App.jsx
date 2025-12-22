
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Roadmap from './components/Roadmap'
import Contact from './components/Contact'
import Community from './components/Community'
import Footer from './components/Footer'
import Team from './components/Team'
import Collaboration from "./components/Collaboration";
// import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      {/* <Analytics /> */}
      <Navbar />
      <Hero />
      <Features />
      <Roadmap />
      <Team />
      <Collaboration />
      <Community />
      <Contact />
      <Footer />
    </ThemeProvider>
  )
}
