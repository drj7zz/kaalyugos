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
    return localStorage.getItem('kaalyug_theme') || 'dark'
  })
  const [initialAppToOpen, setInitialAppToOpen] = useState(null)

  useEffect(() => {
    localStorage.setItem('kaalyug_is_locked', JSON.stringify(isLocked))
  }, [isLocked])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('kaalyug_theme', theme)
  }, [theme])

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
