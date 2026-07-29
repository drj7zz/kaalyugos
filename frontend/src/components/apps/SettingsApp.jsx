import React, { useState } from 'react';
import { Settings, Palette, Image, RotateCcw, Lock, HardDrive } from 'lucide-react';

const WALLPAPERS = [
  { id: 'glyph', name: 'Glyph Architecture', url: '/glyph-bg.svg' },
  { id: 'matrix', name: 'Matrix Monochrome', url: '/matrix-bg.svg' },
  { id: 'white', name: 'Pure Minimal Light', url: '/white-bg.svg' },
  { id: 'default', name: 'Cosmic Sky', url: '/bg.jpeg' },
  { id: 'nebula', name: 'Dark Nebula', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2000&q=80' },
  { id: 'minimal', name: 'Cyber Minimal', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80' },
];

const SettingsApp = ({ theme, setTheme }) => {
  const [customBg, setCustomBg] = useState('');
  const [activeWallpaper, setActiveWallpaper] = useState(() => {
    return localStorage.getItem('kaalyug_wallpaper') || '/bg.jpeg';
  });

  const applyWallpaper = (url) => {
    setActiveWallpaper(url);
    localStorage.setItem('kaalyug_wallpaper', url);
    const bgElem = document.querySelector('.os-background');
    if (bgElem) bgElem.style.backgroundImage = `url('${url}')`;
    const lockBg = document.querySelector('.lockscreen-bg');
    if (lockBg) lockBg.style.backgroundImage = `url('${url}')`;
  };

  const handleResetVfs = () => {
    if (confirm('Reset Virtual File System to default files? Your customized notes and files will be restored to defaults.')) {
      localStorage.removeItem('kaalyug_vfs');
      localStorage.removeItem('kaalyug_notes');
      alert('Virtual storage restored to default. Changes will appear on next app launch.');
    }
  };

  return (
    <div className="os-app-content settings-app">
      <h2><Settings size={20} /> System Settings</h2>

      {/* Theme selection */}
      <div className="info-card">
        <h3><Palette size={18} /> Visual Theme</h3>
        <p style={{ margin: '6px 0 12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Choose your interface style across window panels, dock, and controls.
        </p>
        <div className="theme-options">
          <button
            className={theme === 'dark' ? 'active-theme' : ''}
            onClick={() => setTheme('dark')}
          >
            Dark Mode (Default)
          </button>
          <button
            className={theme === 'blue' ? 'active-theme' : ''}
            onClick={() => setTheme('blue')}
          >
            Blue Horizon
          </button>
        </div>
      </div>

      {/* Wallpaper picker */}
      <div className="info-card">
        <h3><Image size={18} /> Desktop Wallpaper</h3>
        <p style={{ margin: '6px 0 12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Select a system background or provide an external image URL:
        </p>
        <div className="settings-wallpaper-grid">
          {WALLPAPERS.map(wp => (
            <div
              key={wp.id}
              className={`wallpaper-thumb-card ${activeWallpaper === wp.url ? 'active' : ''}`}
              onClick={() => applyWallpaper(wp.url)}
            >
              <div
                className="wallpaper-thumb-img"
                style={{ backgroundImage: `url('${wp.url}')` }}
              />
              <span>{wp.name}</span>
            </div>
          ))}
        </div>

        <div className="custom-wallpaper-form">
          <input
            placeholder="Paste custom wallpaper image URL..."
            value={customBg}
            onChange={e => setCustomBg(e.target.value)}
          />
          <button
            onClick={() => {
              if (customBg.trim()) {
                applyWallpaper(customBg.trim());
                setCustomBg('');
              }
            }}
          >
            Apply
          </button>
        </div>
      </div>

      {/* System Storage & Maintenance */}
      <div className="info-card">
        <h3><HardDrive size={18} /> Storage & System Maintenance</h3>
        <p style={{ margin: '6px 0 14px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Manage client-side virtual disks and application caches.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="settings-danger-btn" onClick={handleResetVfs}>
            <RotateCcw size={14} /> Reset Virtual Disk & Notes
          </button>
          <button
            className="sysinfo-secondary-btn"
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'l', ctrlKey: true }));
            }}
          >
            <Lock size={14} /> Lock System Screen (Ctrl+L)
          </button>
        </div>
      </div>

      {/* System version badge */}
      <div className="settings-version-card">
        <div className="settings-version-icon"><Settings size={28} color="var(--text-muted)" /></div>
        <div>
          <b>Kaalyug OS</b>
          <span>Version 2.0.0 LTS — Web Desktop Environment</span>
          <span>© 2026 Kaalyug OS Project. Open source under MIT License.</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsApp;
