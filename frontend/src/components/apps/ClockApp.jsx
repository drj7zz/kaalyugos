import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, RotateCcw, Flag, Hourglass, Globe2, Bell } from 'lucide-react';

const WORLD_CITIES = [
  { city: 'Local Time', tz: undefined },
  { city: 'London (UTC+1)', tz: 'Europe/London' },
  { city: 'New York (EDT)', tz: 'America/New_York' },
  { city: 'Tokyo (JST)', tz: 'Asia/Tokyo' },
  { city: 'Kathmandu (NPT)', tz: 'Asia/Kathmandu' },
];

const PRESET_TIMERS = [
  { label: '1 Min', seconds: 60 },
  { label: '5 Min', seconds: 300 },
  { label: '15 Min', seconds: 900 },
  { label: '25 Min (Pomodoro)', seconds: 1500 },
];

const ClockApp = () => {
  const [activeTab, setActiveTab] = useState('clock');
  const [now, setNow] = useState(new Date());

  // Stopwatch state
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const swRef = useRef(null);

  // Timer state
  const [timerTotal, setTimerTotal] = useState(300);
  const [timerRemaining, setTimerRemaining] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const timerRef = useRef(null);

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Stopwatch interval
  useEffect(() => {
    if (swRunning) {
      const startTime = Date.now() - swTime;
      swRef.current = setInterval(() => {
        setSwTime(Date.now() - startTime);
      }, 10);
    } else {
      clearInterval(swRef.current);
    }
    return () => clearInterval(swRef.current);
  }, [swRunning]);

  // Timer countdown
  useEffect(() => {
    if (timerRunning && timerRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            setTimerCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timerRemaining]);

  const formatDigits = (num) => String(num).padStart(2, '0');

  // Format stopwatch ms
  const formatStopwatch = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${formatDigits(minutes)}:${formatDigits(seconds)}.${formatDigits(centiseconds)}`;
  };

  // Format timer seconds
  const formatTimer = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${formatDigits(m)}:${formatDigits(s)}`;
  };

  const handleLap = () => {
    if (swTime > 0) {
      setLaps(prev => [swTime, ...prev]);
    }
  };

  const resetStopwatch = () => {
    setSwRunning(false);
    setSwTime(0);
    setLaps([]);
  };

  const setTimerPreset = (secs) => {
    setTimerRunning(false);
    setTimerCompleted(false);
    setTimerTotal(secs);
    setTimerRemaining(secs);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerCompleted(false);
    setTimerRemaining(timerTotal);
  };

  return (
    <div className="utility-app clock-app">
      {/* Clock navigation tabs */}
      <div className="clock-nav-tabs">
        <button
          className={`clock-tab-btn ${activeTab === 'clock' ? 'active' : ''}`}
          onClick={() => setActiveTab('clock')}
        >
          <Clock size={14} /> Clock
        </button>
        <button
          className={`clock-tab-btn ${activeTab === 'stopwatch' ? 'active' : ''}`}
          onClick={() => setActiveTab('stopwatch')}
        >
          <Flag size={14} /> Stopwatch
        </button>
        <button
          className={`clock-tab-btn ${activeTab === 'timer' ? 'active' : ''}`}
          onClick={() => setActiveTab('timer')}
        >
          <Hourglass size={14} /> Timer
        </button>
      </div>

      {/* TAB 1: CLOCK & WORLD TIME */}
      {activeTab === 'clock' && (
        <div className="clock-panel-content">
          <div className="clock-hero-card">
            <span className="clock-hero-tag">SYSTEM TIME</span>
            <div className="clock-big-digits">
              {formatDigits(now.getHours())}
              <span className="clock-colon">:</span>
              {formatDigits(now.getMinutes())}
              <span className="clock-colon">:</span>
              {formatDigits(now.getSeconds())}
            </div>
            <div className="clock-hero-date">
              {now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <div className="world-clock-section">
            <h3 className="clock-section-title">
              <Globe2 size={14} /> World Time
            </h3>
            <div className="world-clock-grid">
              {WORLD_CITIES.map((c, idx) => {
                let timeStr = '';
                try {
                  timeStr = now.toLocaleTimeString([], {
                    timeZone: c.tz,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                  });
                } catch {
                  timeStr = now.toLocaleTimeString([], { hour12: false });
                }

                return (
                  <div key={idx} className="world-clock-card">
                    <span className="wc-city">{c.city}</span>
                    <span className="wc-time">{timeStr}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STOPWATCH */}
      {activeTab === 'stopwatch' && (
        <div className="clock-panel-content">
          <div className="stopwatch-display-card">
            <span className="clock-hero-tag">STOPWATCH</span>
            <div className="stopwatch-digits">{formatStopwatch(swTime)}</div>
            <div className="clock-btn-row">
              <button
                className={`clock-main-btn ${swRunning ? 'pause' : 'start'}`}
                onClick={() => setSwRunning(!swRunning)}
              >
                {swRunning ? <><Pause size={15} /> Pause</> : <><Play size={15} /> Start</>}
              </button>
              {swRunning && (
                <button className="clock-secondary-btn" onClick={handleLap}>
                  <Flag size={14} /> Lap
                </button>
              )}
              {!swRunning && swTime > 0 && (
                <button className="clock-secondary-btn" onClick={resetStopwatch}>
                  <RotateCcw size={14} /> Reset
                </button>
              )}
            </div>
          </div>

          {laps.length > 0 && (
            <div className="laps-container">
              <h4 className="clock-section-title">Laps Recorded</h4>
              <div className="laps-list">
                {laps.map((lap, i) => (
                  <div key={i} className="lap-item">
                    <span className="lap-num">Lap {laps.length - i}</span>
                    <span className="lap-val">{formatStopwatch(lap)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TIMER */}
      {activeTab === 'timer' && (
        <div className="clock-panel-content">
          <div className="timer-display-card">
            <span className="clock-hero-tag">COUNTDOWN TIMER</span>
            <div className={`timer-digits ${timerRemaining === 0 ? 'pulse-done' : ''}`}>
              {formatTimer(timerRemaining)}
            </div>
            {timerCompleted && (
              <div className="timer-alert-badge">
                <Bell size={14} /> Time Completed!
              </div>
            )}
            <div className="clock-btn-row">
              <button
                className={`clock-main-btn ${timerRunning ? 'pause' : 'start'}`}
                onClick={() => {
                  if (timerRemaining === 0) resetTimer();
                  setTimerRunning(!timerRunning);
                  setTimerCompleted(false);
                }}
              >
                {timerRunning ? <><Pause size={15} /> Pause</> : <><Play size={15} /> Start</>}
              </button>
              <button className="clock-secondary-btn" onClick={resetTimer}>
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>

          <div className="timer-presets-section">
            <h4 className="clock-section-title">Quick Presets</h4>
            <div className="timer-presets-grid">
              {PRESET_TIMERS.map(p => (
                <button
                  key={p.label}
                  className={`timer-preset-btn ${timerTotal === p.seconds ? 'active' : ''}`}
                  onClick={() => setTimerPreset(p.seconds)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClockApp;

