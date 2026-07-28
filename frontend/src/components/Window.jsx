import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import './Window.css';
import { X, Minus, Square, Copy } from 'lucide-react';

import SystemInfoApp from './apps/SystemInfoApp';
import FileManagerApp from './apps/FileManagerApp';
import TerminalApp from './apps/TerminalApp';
import CalculatorApp from './apps/CalculatorApp';
import NotesApp from './apps/NotesApp';
import ActivityMonitorApp from './apps/ActivityMonitorApp';
import BrowserApp from './apps/BrowserApp';
import AiApp from './apps/AiApp';
import SettingsApp from './apps/SettingsApp';
import SnakeApp from './apps/SnakeApp';
import CommunityChatApp from './apps/CommunityChatApp';
import AccountsApp from './apps/AccountsApp';
import SupportApp from './apps/SupportApp';
import ApplicationsApp from './apps/ApplicationsApp';

const Window = ({ app, isActive, onFocus, onClose, onMinimize, isMinimized, theme, setTheme, onOpenApp }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  const desktopWidth = Math.min(680, window.innerWidth - 48);
  const desktopHeight = Math.min(520, window.innerHeight - 76);
  const [isFullScreen, setIsFullScreen] = useState(window.innerWidth <= 768);
  const AppIcon = app.icon;

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  const renderContent = () => {
    switch(app.id) {
      case 'sysinfo':
        return <SystemInfoApp onOpenApp={onOpenApp} />;
      case 'finder':
        return <FileManagerApp />;
      case 'terminal':
        return <TerminalApp onOpenApp={onOpenApp} theme={theme} setTheme={setTheme} />;
      case 'calculator':
        return <CalculatorApp />;
      case 'notes':
        return <NotesApp />;
      case 'activity':
        return <ActivityMonitorApp />;
      case 'browser':
        return <BrowserApp />;
      case 'yug_ai':
        return <AiApp />;
      case 'settings':
        return <SettingsApp theme={theme} setTheme={setTheme} />;
      case 'snake':
        return <SnakeApp />;
      case 'messages':
        return <CommunityChatApp />;
      case 'accounts':
        return <AccountsApp />;
      case 'support':
        return <SupportApp />;
      case 'applications':
        return <ApplicationsApp onOpenApp={onOpenApp} />;
      default:
        return <SystemInfoApp onOpenApp={onOpenApp} />;
    }
  };

  return (
    <Rnd
      default={{
        x: isMobile ? 0 : Math.max(24, (window.innerWidth - desktopWidth) / 2),
        y: isMobile ? 0 : Math.max(12, (window.innerHeight - desktopHeight) / 2),
        width: isMobile ? '100%' : desktopWidth,
        height: isMobile ? '100%' : desktopHeight,
      }}
      size={isFullScreen ? { width: '100%', height: '100%' } : undefined}
      position={isFullScreen ? { x: 0, y: 0 } : undefined}
      minWidth={320}
      minHeight={250}
      bounds=".workspace"
      dragHandleClassName="window-header"
      onMouseDown={onFocus}
      disableDragging={isFullScreen}
      enableResizing={!isFullScreen}
      style={{ zIndex: isActive ? 100 : 10, display: isMinimized ? 'none' : undefined }}
      className={`glass-window ${isActive ? 'active' : ''} ${isFullScreen ? 'fullscreen' : ''}`}
    >
      <div className="window-inner">
        {isMobile && <div className="ios-drag-handle" />}
        <div className="window-header windows-header" onDoubleClick={toggleFullScreen}>
          <div className="window-title-bar">
            {AppIcon && <AppIcon size={14} className="window-app-icon" />}
            <span className="window-title">{app.title}</span>
          </div>
          <div className="windows-controls">
            <button
              className="win-btn win-minimize"
              onClick={(e) => { e.stopPropagation(); if (onMinimize) onMinimize(); }}
              title="Minimize"
              aria-label="Minimize"
            >
              <Minus size={13} strokeWidth={1.8} />
            </button>
            <button
              className="win-btn win-maximize"
              onClick={(e) => { e.stopPropagation(); toggleFullScreen(); }}
              title={isFullScreen ? "Restore Down" : "Maximize"}
              aria-label={isFullScreen ? "Restore Down" : "Maximize"}
            >
              {isFullScreen ? (
                <Copy size={11} strokeWidth={1.8} />
              ) : (
                <Square size={11} strokeWidth={1.8} />
              )}
            </button>
            <button
              className="win-btn win-close"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              title="Close"
              aria-label="Close"
            >
              <X size={14} strokeWidth={1.8} />
            </button>
          </div>
        </div>
        <div className="window-content">
          {renderContent()}
        </div>
      </div>
    </Rnd>
  );
};

export default Window;
