import React, { useState, useEffect, useCallback } from 'react';
import './Desktop.css';
import {
  Wifi, Battery, Search, Folder, Files, Grid2X2, Settings,
  Lock, HelpCircle, Globe, Terminal, MessageCircle, Sparkles, Bell,
  Info, Gamepad2, Users, X, ChevronRight, ChevronLeft, Monitor,
  Calculator, FileText, Activity
} from 'lucide-react';
import Window from './Window';

const apps = [
  { id: 'sysinfo', title: 'System Info', icon: Monitor, color: '#34C759' },
  { id: 'finder', title: 'Files & Storage', icon: Files, color: '#5AC8FA' },
  { id: 'terminal', title: 'Terminal', icon: Terminal, color: '#1C1C1E' },
  { id: 'calculator', title: 'Calculator', icon: Calculator, color: '#FF9500' },
  { id: 'notes', title: 'Notes', icon: FileText, color: '#FFCC00' },
  { id: 'activity', title: 'Activity Monitor', icon: Activity, color: '#FF2D55' },
  { id: 'browser', title: 'Browser', icon: Globe, color: '#0A84FF' },
  { id: 'yug_ai', title: 'Yug AI', icon: Sparkles, color: '#AF52DE' },
  { id: 'settings', title: 'Settings', icon: Settings, color: '#8E8E93' },
  { id: 'snake', title: 'Arcade Snake', icon: Gamepad2, color: '#30D158' },
  { id: 'messages', title: 'Community Chat', icon: MessageCircle, color: '#007AFF' },
  { id: 'accounts', title: 'Accounts', icon: Users, color: '#64D2FF' },
  { id: 'support', title: 'Help & Docs', icon: HelpCircle, color: '#E056FD' },
  { id: 'applications', title: 'Applications', icon: Grid2X2, color: '#5856D6' },
];

const desktopShortcuts = [
  { id: 'finder', title: 'Files', icon: Folder },
  { id: 'notes', title: 'Notes', icon: Folder },
  { id: 'terminal', title: 'Terminal', icon: Folder },
  { id: 'sysinfo', title: 'About OS', icon: Folder },
];

// Tutorial steps
const tutorialSteps = [
  {
    title: 'Welcome to Kaalyug OS',
    body: 'Kaalyug OS is a complete web-based operating system. Featuring a floating window compositor, POSIX terminal shell, virtual file system, productivity apps, and native AI kernel.'
  },
  {
    title: 'Productivity & System Apps',
    body: '• Files & Storage: Browse, create, and manage virtual files\n• Notes: Full markdown & text editor with local persistence\n• Calculator: Scientific and standard arithmetic\n• Terminal: Interactive shell with neofetch, top, ls, cat, and more\n• Activity Monitor: Live CPU, memory, and process manager\n• Yug AI: Native conversational intelligence core'
  },
  {
    title: 'Navigation & Windows',
    body: '• Click any dock app to launch or minimize it.\n• Double-click any window titlebar to toggle fullscreen.\n• Drag window headers to reposition windows on your workspace.\n• Spotlight Search: Press Ctrl + K (or Cmd + K) anytime.\n• Lock Screen: Press Ctrl + L to lock.'
  },
  {
    title: 'Customization & Settings',
    body: '• Customize themes (Dark, Blue, Pink) and wallpapers in Settings.\n• Create multiple local accounts or continue as Administrator/Guest.\n• The Terminal supports "help", "neofetch", "open <app>", and "theme <name>".'
  },
];

const Desktop = ({ theme, setTheme, onLock, initialAppToOpen, clearInitialApp }) => {
  const [time, setTime] = useState(new Date());
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [minimizedWindows, setMinimizedWindows] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Kaalyug OS', body: 'Welcome to Kaalyug OS v2.0 LTS', time: 'Just now', iconType: 'os' },
    { id: 2, title: 'Tip', body: 'Press Ctrl/Cmd + K for Spotlight Search', time: 'Just now', iconType: 'tip' },
    { id: 3, title: 'Yug AI Core', body: 'Intelligent assistant is online and ready', time: 'Just now', iconType: 'ai' },
  ]);
  const [notifPermission, setNotifPermission] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'default');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === 'k') { event.preventDefault(); setShowSearch(true); setSearchQuery(''); }
      if ((event.metaKey || event.ctrlKey) && key === 'l') { event.preventDefault(); onLock(); }
      if (key === 'escape') { setShowSearch(false); setShowNotifications(false); setShowTutorial(false); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onLock]);

  const openApp = useCallback((app) => {
    setOpenWindows(prev => {
      if (!prev.find(w => w.id === app.id)) {
        return [...prev, app];
      }
      return prev;
    });
    setMinimizedWindows(prev => prev.filter(id => id !== app.id));
    setActiveWindow(app.id);
  }, []);

  const toggleApp = useCallback((app) => {
    const isOpen = openWindows.find(w => w.id === app.id);
    if (isOpen) {
      if (activeWindow === app.id && !minimizedWindows.includes(app.id)) {
        setMinimizedWindows(prev => [...prev, app.id]);
        setActiveWindow(null);
      } else {
        setMinimizedWindows(prev => prev.filter(id => id !== app.id));
        setActiveWindow(app.id);
      }
    } else {
      openApp(app);
    }
  }, [openWindows, activeWindow, minimizedWindows, openApp]);

  useEffect(() => {
    if (initialAppToOpen) {
      const targetApp = apps.find(a => a.id === initialAppToOpen);
      if (targetApp) {
        queueMicrotask(() => openApp(targetApp));
      }
      if (clearInitialApp) clearInitialApp();
    }
  }, [initialAppToOpen, openApp, clearInitialApp]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatMobileTime = (date) => date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const closeApp = useCallback((appId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== appId));
    setMinimizedWindows(prev => prev.filter(id => id !== appId));
    setActiveWindow(prevActive => prevActive === appId ? null : prevActive);
  }, []);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) setSearchQuery('');
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const requestNotifPermission = async () => {
    if (typeof Notification !== 'undefined') {
      const result = await Notification.requestPermission();
      setNotifPermission(result);
      if (result === 'granted') {
        new Notification('Kaalyug OS', { body: 'Notifications enabled! 🎉', icon: '/favicon.svg' });
      }
    }
  };

  const searchableApps = apps.map(app => ({
    ...app,
    keywords: ({
      sysinfo: 'about system info specifications hardware cpu memory kernel uptime os',
      finder: 'files storage finder file manager documents folders disk explorer',
      terminal: 'terminal console shell bash cli posix neofetch commands',
      calculator: 'calculator math compute numbers scientific arithmetic',
      notes: 'notes notepad text editor write markdown document code scratchpad',
      activity: 'activity monitor task manager processes cpu memory usage kill tasks',
      browser: 'browser web internet surf google duckduckgo online',
      yug_ai: 'yug ai artificial intelligence assistant gemini chat help',
      settings: 'settings appearance themes dark blue pink customization wallpaper',
      snake: 'snake game arcade play retro highscore',
      messages: 'yug chat messages global community real time chat',
      accounts: 'accounts user profile login guest switch password credentials',
      support: 'support help documentation faq shortcuts guide customer care',
      applications: 'applications app library all apps grid launcher',
    }[app.id] || app.title).toLowerCase(),
  }));
  const searchResults = searchableApps.filter(app => app.keywords.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleMenuClick = (menu) => {
    if (menu === 'View') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen?.();
      }
    } else if (menu === 'Settings') {
      openApp(apps.find(a => a.id === 'settings'));
    } else if (menu === 'Support' || menu === 'Customer Care') {
      openApp(apps.find(a => a.id === 'support'));
    } else if (menu === 'Applications') {
      openApp(apps.find(a => a.id === 'applications'));
    }
  };

  return (
    <div className="desktop-container">
      {/* Menu Bar */}
      <div className="menu-bar glass-panel">
        <div className="mobile-status-bar">
          <span>{formatMobileTime(time)}</span>
          <span className="dynamic-island" aria-label="Dynamic Island" />
          <div>
            <Wifi size={15} />
            <Battery size={16} />
            <button className="mobile-lock-button" onClick={onLock} aria-label="Lock screen" title="Lock screen">
              <Lock size={15} />
            </button>
            <button className="mobile-lock-button" onClick={toggleSearch} aria-label="Search applications" title="Search applications">
              <Search size={15} />
            </button>
          </div>
        </div>
        <div className="menu-left">
          <div className="apple-logo-img" title="Lock Screen" onClick={onLock}>
            <img src="/bg.jpeg" alt="Logo" width={22} height={22} style={{ borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <span className="menu-item fw-bold">Kaalyug OS</span>
          <span className="menu-item">File</span>
          <span className="menu-item">Edit</span>
          <span className="menu-item" onClick={() => handleMenuClick('View')}>View</span>
          <span className="menu-item" onClick={() => handleMenuClick('Settings')}>Settings</span>
          <span className="menu-item" onClick={() => handleMenuClick('Support')}>Help</span>
          <span className="menu-item" onClick={() => handleMenuClick('Applications')}>Applications</span>
        </div>
        <div className="menu-right">
          <span className="menu-icon" onClick={toggleSearch} title="Search"><Search size={16} /></span>
          <span className="menu-icon" onClick={() => setShowNotifications(prev => !prev)} title="Notifications"><Bell size={15} /></span>
          <span className="menu-icon" onClick={() => { setShowTutorial(true); setTutorialStep(0); }} title="How to use"><Info size={15} /></span>
          <span className="menu-icon" onClick={onLock} title="Lock Screen"><Lock size={15} /></span>
          <span className="menu-icon"><Wifi size={16} /></span>
          <span className="menu-icon"><Battery size={16} /></span>
          <span className="menu-time">{formatTime(time)}</span>
        </div>
      </div>

      {/* Workspace & Shortcuts */}
      <div className="workspace">
        <div className="desktop-icons">
          {desktopShortcuts.map(shortcut => {
            const Icon = shortcut.icon;
            const fullApp = apps.find(a => a.id === shortcut.id);
            return (
              <div key={shortcut.id} className="desktop-shortcut" onClick={() => openApp(fullApp)}>
                <div className="shortcut-icon-wrapper">
                  <Icon size={48} color="#007AFF" fill="rgba(0,122,255,0.2)" />
                </div>
                <span className="shortcut-title">{shortcut.title}</span>
              </div>
            );
          })}
        </div>

        <div className="mobile-app-grid">
          {apps.filter(app => !['finder', 'applications'].includes(app.id)).map(app => {
            const Icon = app.icon;
            return (
              <button key={app.id} className="mobile-app" onClick={() => openApp(app)}>
                <span className="mobile-app-icon" style={{ backgroundColor: app.color }}>
                  <Icon size={29} color="#fff" />
                </span>
                <span>{app.title}</span>
              </button>
            );
          })}
          <button className="mobile-app all-apps-button" onClick={() => openApp(apps.find(app => app.id === 'applications'))}><span className="mobile-app-icon" style={{ backgroundColor: '#34C759' }}><Grid2X2 size={29} color="#fff" /></span><span>Applications</span></button>
        </div>

        {openWindows.map(app => (
          <Window
            key={app.id}
            app={app}
            isActive={activeWindow === app.id}
            isMinimized={minimizedWindows.includes(app.id)}
            onFocus={() => {
              setActiveWindow(app.id);
              setMinimizedWindows(prev => prev.filter(id => id !== app.id));
            }}
            onClose={() => closeApp(app.id)}
            onMinimize={() => {
              setMinimizedWindows(prev => [...prev, app.id]);
              if (activeWindow === app.id) setActiveWindow(null);
            }}
            theme={theme}
            setTheme={setTheme}
            onOpenApp={openApp}
          />
        ))}

        {/* Spotlight Search Overlay */}
        {showSearch && (
          <div className="spotlight-overlay" onClick={toggleSearch}>
            <div className="spotlight-container glass-panel" onClick={e => e.stopPropagation()}>
              <Search size={24} color="#888" />
              <input
                type="text"
                placeholder="Search Kaalyug OS..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && <div className="search-results">
                {searchResults.length ? searchResults.map(app => { const Icon = app.icon; return <button key={app.id} onClick={() => { openApp(app); setShowSearch(false); }}><Icon size={18} /><span>{app.title}</span></button>; }) : <span className="search-empty">No applications found</span>}
                <button className="web-search-result" onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank', 'noopener,noreferrer')}><Search size={18} /><span>Search the web for &quot;{searchQuery}&quot;</span></button>
              </div>}
            </div>
          </div>
        )}

        {/* Notification Center */}
        {showNotifications && (
          <div className="notification-center glass-panel">
            <div className="notif-header">
              <b>Notifications</b>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                {notifications.length > 0 && <button className="notif-clear-all" onClick={() => setNotifications([])}>Clear All</button>}
                <button className="notif-dismiss" style={{position:'static'}} onClick={() => setShowNotifications(false)} title="Close"><X size={13} /></button>
              </div>
            </div>
            {notifPermission !== 'granted' && (
              <div className="notif-permission-card">
                <Bell size={18} />
                <div>
                  <b>Enable Notifications</b>
                  <p>Get alerts from Kaalyug OS</p>
                </div>
                <button onClick={requestNotifPermission}>{notifPermission === 'denied' ? 'Blocked' : 'Allow'}</button>
              </div>
            )}
            {notifications.length === 0 && <p className="notif-empty">No notifications</p>}
            {notifications.map(n => (
              <div key={n.id} className="notif-card">
                <span className="notif-icon">{n.iconType === 'os' ? <Monitor size={16} /> : n.iconType === 'tip' ? <Info size={16} /> : <Sparkles size={16} />}</span>
                <div className="notif-body">
                  <b>{n.title}</b>
                  <span>{n.body}</span>
                  <small>{n.time}</small>
                </div>
                <button className="notif-dismiss" onClick={() => dismissNotification(n.id)}><X size={12} /></button>
              </div>
            ))}
          </div>
        )}

        {/* Tutorial Overlay */}
        {showTutorial && (
          <div className="tutorial-overlay" onClick={() => setShowTutorial(false)}>
            <div className="tutorial-card glass-panel" onClick={e => e.stopPropagation()}>
              <button className="tutorial-close" onClick={() => setShowTutorial(false)} title="Close"><X size={15} /></button>
              <div className="tutorial-step-indicator">
                {tutorialSteps.map((_, i) => (
                  <span key={i} className={`tutorial-dot ${i === tutorialStep ? 'active' : ''}`} />
                ))}
              </div>
              <h2>{tutorialSteps[tutorialStep].title}</h2>
              <div className="tutorial-body">
                {tutorialSteps[tutorialStep].body.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              </div>
              <div className="tutorial-actions">
                {tutorialStep > 0 && <button className="tutorial-btn-secondary" onClick={() => setTutorialStep(s => s - 1)}><ChevronLeft size={14} /> Back</button>}
                {tutorialStep < tutorialSteps.length - 1 ? (
                  <button onClick={() => setTutorialStep(s => s + 1)}>Next <ChevronRight size={14} /></button>
                ) : (
                  <button onClick={() => setShowTutorial(false)}>Got it ✓</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dock */}
      <div className={`dock-container ${activeWindow ? 'app-active' : ''}`}>
        <div className="dock glass-panel">
          {apps.map(app => {
            const Icon = app.icon;
            const isOpen = openWindows.find(w => w.id === app.id);
            return (
              <div
                key={app.id}
                className={`dock-item ${['finder', 'notes', 'terminal', 'calculator', 'browser', 'sysinfo'].includes(app.id) ? 'mobile-essential' : 'mobile-optional'} ${isOpen ? 'is-open' : ''}`}
                onClick={() => toggleApp(app)}
                title={app.title}
              >
                <div className="dock-icon" style={{ backgroundColor: app.color }}>
                  <Icon size={24} color="#fff" />
                </div>
                {isOpen && <div className="dock-indicator" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Desktop;
