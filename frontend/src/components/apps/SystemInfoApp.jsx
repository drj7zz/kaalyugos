import React, { useState, useEffect } from 'react';
import { Monitor, Cpu, ShieldCheck, CheckCircle2, RefreshCw, Activity, Terminal, Layers } from 'lucide-react';

const SystemInfoApp = ({ onOpenApp }) => {
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [cpuUsage, setCpuUsage] = useState(14);
  const [memUsage, setMemUsage] = useState(2.3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(10 + Math.random() * 18));
      setMemUsage(parseFloat((2.1 + Math.random() * 0.4).toFixed(2)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleCheckUpdate = () => {
    setCheckingUpdate(true);
    setUpdateStatus(null);
    setTimeout(() => {
      setCheckingUpdate(false);
      setUpdateStatus('Kaalyug OS 2.0.0 LTS is currently up to date. Latest patch applied.');
    }, 1200);
  };

  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8;
  const platform = typeof navigator !== 'undefined' ? (navigator.userAgentData?.platform || navigator.platform || 'WebAssembly VM') : 'WebAssembly VM';
  const language = typeof navigator !== 'undefined' ? navigator.language : 'en-US';

  return (
    <div className="os-app-content sysinfo-page">
      <div className="profile-header-card sysinfo-header">
        <div className="sysinfo-logo-badge">
          <Monitor size={42} color="#0A84FF" />
        </div>
        <div className="profile-header-info">
          <h1>Kaalyug OS</h1>
          <p className="subtitle">Version 2.0.0 LTS · Web Kernel Architecture</p>
          <div className="location-badge">
            <ShieldCheck size={14} color="#30D158" /> System Status: Optimal
          </div>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3><Cpu size={18} /> Hardware & Environment</h3>
          <ul className="sysinfo-specs-list">
            <li><span>Architecture:</span> <b>x86_64 Virtualized</b></li>
            <li><span>Kernel:</span> <b>Kaalyug-WebKernel 2.0</b></li>
            <li><span>Developer:</span> <a href="https://drj7zz.vercel.app" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}><b>drj7zz.vercel.app ↗</b></a></li>
            <li><span>Contribute:</span> <a href="https://github.com/drj7zz/kaalyugos" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}><b>github.com/drj7zz/kaalyugos ↗</b></a></li>
            <li><span>Processor Cores:</span> <b>{cores} Logical Cores</b></li>
            <li><span>Compositor:</span> <b>Liquid Glass Compositor</b></li>
            <li><span>Platform Host:</span> <b>{platform}</b></li>
            <li><span>Language:</span> <b>{language}</b></li>
          </ul>
        </div>

        <div className="info-card">
          <h3><Activity size={18} /> Live Resource Telemetry</h3>
          <div className="telemetry-item">
            <div className="telemetry-label">
              <span>CPU Utilization</span>
              <b>{cpuUsage}%</b>
            </div>
            <div className="telemetry-bar-bg">
              <div className="telemetry-bar-fill" style={{ width: `${cpuUsage}%`, backgroundColor: cpuUsage > 75 ? '#FF453A' : '#30D158' }} />
            </div>
          </div>

          <div className="telemetry-item">
            <div className="telemetry-label">
              <span>Virtual RAM</span>
              <b>{memUsage} GB / 8.00 GB</b>
            </div>
            <div className="telemetry-bar-bg">
              <div className="telemetry-bar-fill" style={{ width: `${(memUsage / 8.0) * 100}%`, backgroundColor: '#0A84FF' }} />
            </div>
          </div>

          <div className="telemetry-item">
            <div className="telemetry-label">
              <span>Virtual Storage</span>
              <b>12.4 MB used (Local VFS)</b>
            </div>
            <div className="telemetry-bar-bg">
              <div className="telemetry-bar-fill" style={{ width: '25%', backgroundColor: '#BF5AF2' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="info-card">
        <h3><Layers size={18} /> System Diagnostics & Update</h3>
        <p style={{ margin: '6px 0 14px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Kaalyug OS manages unified process scheduling, window compositing, and sandboxed browser applications.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="sysinfo-action-btn" onClick={handleCheckUpdate} disabled={checkingUpdate}>
            <RefreshCw size={14} className={checkingUpdate ? 'spin-anim' : ''} />
            {checkingUpdate ? 'Checking Server...' : 'Check for System Updates'}
          </button>
          {onOpenApp && (
            <button className="sysinfo-secondary-btn" onClick={() => onOpenApp({ id: 'activity', title: 'Activity Monitor' })}>
              <Activity size={14} /> Open Activity Monitor
            </button>
          )}
          {onOpenApp && (
            <button className="sysinfo-secondary-btn" onClick={() => onOpenApp({ id: 'terminal', title: 'Terminal' })}>
              <Terminal size={14} /> Open Shell
            </button>
          )}
        </div>
        {updateStatus && (
          <div className="sysinfo-update-alert">
            <CheckCircle2 size={16} color="#30D158" />
            <span>{updateStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemInfoApp;
