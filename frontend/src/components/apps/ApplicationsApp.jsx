import React, { useState } from 'react';
import { 
  Grid2X2, Monitor, Files, Terminal, Calculator, FileText, Activity, 
  Globe, Sparkles, Settings, Gamepad2, MessageCircle, Users, HelpCircle 
} from 'lucide-react';

const APP_CATALOG = [
  { id: 'sysinfo', title: 'System Info', desc: 'Hardware & OS diagnostics', icon: Monitor, color: '#34C759', category: 'system' },
  { id: 'finder', title: 'Files & Storage', desc: 'Virtual file system explorer', icon: Files, color: '#5AC8FA', category: 'system' },
  { id: 'terminal', title: 'Terminal Shell', desc: 'POSIX command interpreter', icon: Terminal, color: '#1C1C1E', category: 'utilities' },
  { id: 'calculator', title: 'Calculator', desc: 'Standard & scientific math', icon: Calculator, color: '#FF9500', category: 'productivity' },
  { id: 'notes', title: 'Notes & Editor', desc: 'Markdown document notepad', icon: FileText, color: '#FFCC00', category: 'productivity' },
  { id: 'activity', title: 'Activity Monitor', desc: 'Task manager & CPU telemetry', icon: Activity, color: '#FF2D55', category: 'system' },
  { id: 'browser', title: 'Web Browser', desc: 'Internet web surfing', icon: Globe, color: '#0A84FF', category: 'utilities' },
  { id: 'yug_ai', title: 'Yug AI', desc: 'Native AI intelligence core', icon: Sparkles, color: '#AF52DE', category: 'productivity' },
  { id: 'settings', title: 'Settings', desc: 'Appearance, themes & wallpapers', icon: Settings, color: '#8E8E93', category: 'system' },
  { id: 'snake', title: 'Arcade Snake', desc: 'Classic retro arcade game', icon: Gamepad2, color: '#30D158', category: 'fun' },
  { id: 'messages', title: 'Community Chat', desc: 'Global real-time messaging', icon: MessageCircle, color: '#007AFF', category: 'utilities' },
  { id: 'accounts', title: 'User Accounts', desc: 'Profile and security manager', icon: Users, color: '#64D2FF', category: 'system' },
  { id: 'support', title: 'Help & Docs', desc: 'User guide and shortcuts', icon: HelpCircle, color: '#E056FD', category: 'utilities' },
];

const ApplicationsApp = ({ onOpenApp }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = APP_CATALOG.filter(app => {
    if (activeCategory === 'all') return true;
    return app.category === activeCategory;
  });

  return (
    <div className="utility-app applications-app">
      <div className="app-drawer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Grid2X2 size={20} color="#5856D6" />
          <b style={{ fontSize: '16px' }}>Application Library</b>
        </div>
        <div className="app-drawer-tabs">
          {['all', 'productivity', 'system', 'utilities', 'fun'].map(cat => (
            <button
              key={cat}
              className={`app-cat-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="app-drawer-grid-enhanced">
        {filtered.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className="app-card-item"
              onClick={() => onOpenApp?.({ id: item.id, title: item.title })}
            >
              <span className="app-card-icon" style={{ backgroundColor: item.color }}>
                <Icon size={26} color="#fff" />
              </span>
              <span className="app-card-name">{item.title}</span>
              <span className="app-card-desc">{item.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationsApp;
