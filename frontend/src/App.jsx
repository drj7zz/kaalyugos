import React, { useState, useEffect } from 'react'
import LockScreen from './components/LockScreen'
import Desktop from './components/Desktop'
import './App.css'

function App() {
  const [isLocked, setIsLocked] = useState(() => {
    const savedState = localStorage.getItem('kaalyug_is_locked')
    return savedState !== null ? JSON.parse(savedState) : true
  })
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('kaalyug_theme')
    return (saved && saved !== 'pink') ? saved : 'dark'
  })
  const [initialAppToOpen, setInitialAppToOpen] = useState(null)

  useEffect(() => {
    localStorage.setItem('kaalyug_is_locked', JSON.stringify(isLocked))
  }, [isLocked])

  useEffect(() => {
    const activeTheme = theme === 'pink' ? 'dark' : theme
    document.documentElement.setAttribute('data-theme', activeTheme)
    localStorage.setItem('kaalyug_theme', activeTheme)
  }, [theme])

  useEffect(() => {
    let savedWp = localStorage.getItem('kaalyug_wallpaper')
    if (!savedWp) {
      savedWp = '/bg.jpeg'
      localStorage.setItem('kaalyug_wallpaper', savedWp)
    }
    const bgElem = document.querySelector('.os-background')
    if (bgElem) bgElem.style.backgroundImage = `url('${savedWp}')`
    const lockBg = document.querySelector('.lockscreen-bg')
    if (lockBg) lockBg.style.backgroundImage = `url('${savedWp}')`
  }, [])

  const handleUnlock = () => setIsLocked(false)
  const handleOpenAppOnUnlock = (appId) => setInitialAppToOpen(appId)
  const handleLock = () => { setIsLocked(true); setInitialAppToOpen(null) }

  return (
    <div className="os-container">
      {/* Wallpaper — always visible behind everything */}
      <div className="os-background" />

      {isLocked ? (
        <LockScreen
          onUnlock={handleUnlock}
          onOpenAppOnUnlock={handleOpenAppOnUnlock}
        />
      ) : (
        <Desktop
          theme={theme}
          setTheme={setTheme}
          onLock={handleLock}
          initialAppToOpen={initialAppToOpen}
          clearInitialApp={() => setInitialAppToOpen(null)}
        />
      )}
    </div>
  )
}

export default App
