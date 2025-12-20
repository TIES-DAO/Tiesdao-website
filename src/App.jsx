
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Roadmap from './components/Roadmap'
import Contact from './components/Contact'
import Community from './components/Community'
import Footer from './components/Footer'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <Hero />
      <Features />
      <Roadmap />
      <Community />
      <Contact />
      <Footer />
    </ThemeProvider>
  )
}
