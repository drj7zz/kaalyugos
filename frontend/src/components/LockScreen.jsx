import React, { useState, useEffect, useCallback, useRef } from 'react';
import './LockScreen.css';
import { ArrowRight, Wifi, Battery, Volume2, HelpCircle, Lock, CloudSun, ShieldCheck, Zap, Camera } from 'lucide-react';

const LockScreen = ({ onUnlock, onOpenAppOnUnlock }) => {
  const [time, setTime] = useState(new Date());
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [password, setPassword] = useState('');
  const [shake, setShake] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const inputRef = useRef(null);

  const [username] = useState(() => {
    try {
      const savedAcc = JSON.parse(localStorage.getItem('kaalyug_account'));
      return (savedAcc?.name && savedAcc.name !== 'Guest') ? savedAcc.name : 'Administrator';
    } catch {
      return 'Administrator';
    }
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlockTrigger = useCallback((targetAppId = null) => {
    if (isUnlocking) return;
    setIsUnlocking(true);
    setTimeout(() => {
      onUnlock();
      if (targetAppId && onOpenAppOnUnlock) {
        onOpenAppOnUnlock(targetAppId);
      }
    }, 380);
  }, [isUnlocking, onUnlock, onOpenAppOnUnlock]);

  const handleAvatarClick = () => {
    if (!showPasswordField) {
      setShowPasswordField(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.length >= 0) {
      handleUnlockTrigger();
    } else {
      setShake(true);
      setPassword('');
      setTimeout(() => setShake(false), 500);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showSupport && e.key === 'Escape') {
        setShowSupport(false);
        return;
      }
      if (e.key === 'Enter') {
        if (showPasswordField) {
          handleUnlockTrigger();
        } else {
          setShowPasswordField(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }
      if (e.key === 'Escape') {
        setShowPasswordField(false);
        setPassword('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPasswordField, showSupport, handleUnlockTrigger]);

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const formatDate = (date) => date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div
      className={`lockscreen-container ${isUnlocking ? 'unlock-anim' : ''}`}
      onClick={() => {
        if (!showPasswordField && !showSupport) {
          setShowPasswordField(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }}
    >
      {/* Background wallpaper */}
      <div className="lockscreen-bg" />

      {/* Liquid Glass animated blobs */}
      <div className="ls-blob ls-blob-1" />
      <div className="ls-blob ls-blob-2" />
      <div className="ls-blob ls-blob-3" />
      <div className="ls-blob ls-blob-4" />

      {/* Top status bar */}
      <div className="ls-topbar">
        <div className="ls-topbar-left">
          <span className="ls-brand-tag">
            <Lock size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Kaalyug OS
          </span>
        </div>
        <div className="ls-topbar-right">
          <Wifi size={14} color="rgba(255,255,255,0.85)" />
          <Volume2 size={14} color="rgba(255,255,255,0.85)" />
          <Battery size={14} color="rgba(255,255,255,0.85)" />
        </div>
      </div>

      {/* Clock, Date & Minimal Widgets */}
      <div className="ls-clock-section">
        <div className="ls-clock">
          {formatTime(time)}
          <span className="ls-clock-accent-dot" />
        </div>
        <div className="ls-date">{formatDate(time)}</div>

        {/* Minimalist System Widgets */}
        <div className="ls-widgets-row">
          <div className="ls-widget-pill" title="Local Weather">
            <CloudSun size={13} color="rgba(255,255,255,0.9)" />
            <span className="ls-widget-dot-text">24°C</span>
            <span className="ls-widget-sub">Clear</span>
          </div>

          <div className="ls-widget-pill" title="Battery & Power">
            <Battery size={13} color="rgba(255,255,255,0.9)" />
            <span className="ls-widget-dot-text">98%</span>
            <span className="ls-widget-status-dot" />
          </div>

          <div className="ls-widget-pill ls-widget-secure" title="System Security">
            <ShieldCheck size={13} color="#34C759" />
            <span className="ls-widget-dot-text">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* User Login Section */}
      <div className="ls-user-section">
        <div className="ls-glass-card">
          <div
            className={`ls-avatar-ring ${showPasswordField ? 'focused' : ''}`}
            onClick={(e) => { e.stopPropagation(); handleAvatarClick(); }}
            title="Click to sign in"
          >
            <img src="/avatar.svg" alt="User Avatar" className="ls-avatar-img" loading="eager" decoding="sync" fetchPriority="high" />
          </div>

          <div className="ls-username">{username}</div>

          {/* Password field */}
          <div className={`ls-password-section ${showPasswordField ? 'visible' : ''}`}>
            <form onSubmit={handlePasswordSubmit} onClick={(e) => e.stopPropagation()}>
              <div className={`ls-password-field ${shake ? 'shake' : ''}`}>
                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="ls-password-input"
                  autoComplete="off"
                />
                <button type="submit" className="ls-password-btn" aria-label="Unlock">
                  <ArrowRight size={14} color="rgba(255,255,255,0.9)" />
                </button>
              </div>
            </form>
            <button className="ls-skip-btn" onClick={(e) => { e.stopPropagation(); handleUnlockTrigger(); }}>
              Sign In
            </button>
          </div>

          {/* Hint */}
          {!showPasswordField && (
            <div className="ls-click-hint">Click or press Enter to unlock</div>
          )}
        </div>
      </div>

      {/* Bottom bar with quick action buttons */}
      <div className="ls-bottom-bar">
        <button
          className={`ls-corner-btn ${flashlightOn ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setFlashlightOn(!flashlightOn);
          }}
          title={flashlightOn ? 'Turn Flashlight Off' : 'Turn Flashlight On'}
          aria-label="Toggle Flashlight"
        >
          <Zap size={16} color={flashlightOn ? '#ffcc00' : 'rgba(255,255,255,0.85)'} />
        </button>

        <button className="ls-bottom-btn" onClick={(e) => { e.stopPropagation(); setShowSupport(true); }}>
          <HelpCircle size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Help & Shortcuts
        </button>

        <button
          className="ls-corner-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleUnlockTrigger('notes');
          }}
          title="Quick Notes"
          aria-label="Open Notes"
        >
          <Camera size={16} color="rgba(255,255,255,0.85)" />
        </button>
      </div>

      {/* Lockscreen-only Support Overlay */}
      {showSupport && (
        <div className="ls-support-overlay" onClick={() => setShowSupport(false)}>
          <div className="ls-support-card" onClick={(e) => e.stopPropagation()}>
            <h2>Kaalyug OS · Quick Help</h2>
            <p>Welcome to Kaalyug Web Operating System. Keyboard shortcuts & access guide:</p>
            <div className="ls-support-links">
              <div className="ls-support-link" style={{ cursor: 'default' }}>
                <span className="ls-support-link-icon" style={{ background: 'rgba(0,120,212,0.22)' }}><HelpCircle size={18} color="#0078d4" /></span>
                <span className="ls-support-link-info">
                  <span className="ls-support-link-name">Unlock Shortcut</span>
                  <span className="ls-support-link-handle">Press Enter or click &quot;Sign In&quot;</span>
                </span>
              </div>
              <div className="ls-support-link" style={{ cursor: 'default' }}>
                <span className="ls-support-link-icon" style={{ background: 'rgba(52,199,89,0.22)' }}><Wifi size={18} color="#34C759" /></span>
                <span className="ls-support-link-info">
                  <span className="ls-support-link-name">Quick Search</span>
                  <span className="ls-support-link-handle">Press Ctrl + K (or Cmd + K) anytime</span>
                </span>
              </div>
              <div className="ls-support-link" style={{ cursor: 'default' }}>
                <span className="ls-support-link-icon" style={{ background: 'rgba(255,149,0,0.22)' }}><Battery size={18} color="#FF9500" /></span>
                <span className="ls-support-link-info">
                  <span className="ls-support-link-name">Lock Screen</span>
                  <span className="ls-support-link-handle">Press Ctrl + L from the desktop</span>
                </span>
              </div>
            </div>
            <button className="ls-support-close" onClick={() => setShowSupport(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LockScreen;
