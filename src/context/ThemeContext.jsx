import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    // Check localStorage for saved theme
    return localStorage.getItem('theme') === 'light' ? false : true
  })

  const toggleTheme = () => {
    setDark(prev => {
      const newTheme = !prev
      localStorage.setItem('theme', newTheme ? 'dark' : 'light')
      return newTheme
    })
  }

  // Optional: Update <html> class for global tailwind dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      <div className={dark ? 'dark bg-black text-white' : 'bg-white text-black'}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
