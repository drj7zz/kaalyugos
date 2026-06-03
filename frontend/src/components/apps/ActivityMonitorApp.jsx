import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Shield, RefreshCw } from 'lucide-react';

const INITIAL_PROCESSES = [
  { pid: 1, name: 'kaalyug-compositor', user: 'root', cpu: 3.8, mem: 165, status: 'Running', protected: true },
  { pid: 2, name: 'window-manager', user: 'root', cpu: 2.1, mem: 92, status: 'Running', protected: true },
  { pid: 104, name: 'vfs-daemon', user: 'system', cpu: 0.5, mem: 46, status: 'Running', protected: false },
  { pid: 108, name: 'yug-ai-core', user: 'system', cpu: 1.6, mem: 135, status: 'Running', protected: false },
  { pid: 142, name: 'audio-subsystem', user: 'system', cpu: 0.2, mem: 28, status: 'Running', protected: false },
  { pid: 210, name: 'browser-engine', user: 'user', cpu: 1.4, mem: 112, status: 'Running', protected: false },
  { pid: 255, name: 'terminal-shell', user: 'user', cpu: 0.3, mem: 34, status: 'Running', protected: false },
  { pid: 312, name: 'notification-center', user: 'user', cpu: 0.4, mem: 40, status: 'Running', protected: false },
  { pid: 380, name: 'crypto-crypto-worker', user: 'guest', cpu: 0.8, mem: 55, status: 'Idle', protected: false },
];

const ActivityMonitorApp = () => {
  const [processes, setProcesses] = useState(INITIAL_PROCESSES);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setProcesses(prev => prev.map(p => {
        if (p.status === 'Terminated') return p;
        const jitter = (Math.random() - 0.5) * 0.8;
        const newCpu = Math.max(0.1, parseFloat((p.cpu + jitter).toFixed(1)));
        return { ...p, cpu: newCpu };
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const totalCpu = parseFloat(
    processes.filter(p => p.status !== 'Terminated').reduce((acc, p) => acc + p.cpu, 0).toFixed(1)
  );
  const totalMem = Math.round(
    processes.filter(p => p.status !== 'Terminated').reduce((acc, p) => acc + p.mem, 0)
  );

  const killProcess = (pid) => {
    const target = processes.find(p => p.pid === pid);
    if (!target) return;
    if (target.protected) {
      alert(`Cannot kill ${target.name}: It is a protected core system process.`);
      return;
    }
    setProcesses(prev => prev.map(p => p.pid === pid ? { ...p, status: 'Terminated', cpu: 0 } : p));
  };

  const restartProcess = (pid) => {
    setProcesses(prev => prev.map(p => p.pid === pid ? { ...p, status: 'Running', cpu: 1.0 } : p));
  };

  const filtered = processes.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || String(p.pid).includes(search));

  return (
    <div className="utility-app activity-app">
      <div className="activity-summary-grid">
        <div className="activity-stat-box">
          <div className="activity-stat-header">
            <Cpu size={16} color="#30D158" />
            <span>Total CPU Load</span>
          </div>
          <div className="activity-stat-value">{totalCpu}%</div>
          <div className="activity-meter-bg">
            <div className="activity-meter-fill" style={{ width: `${Math.min(100, totalCpu * 2.5)}%`, backgroundColor: '#30D158' }} />
          </div>
        </div>

        <div className="activity-stat-box">
          <div className="activity-stat-header">
            <HardDrive size={16} color="#0A84FF" />
            <span>Active Memory</span>
          </div>
          <div className="activity-stat-value">{totalMem} MB</div>
          <div className="activity-meter-bg">
            <div className="activity-meter-fill" style={{ width: `${Math.min(100, (totalMem / 2048) * 100)}%`, backgroundColor: '#0A84FF' }} />
          </div>
        </div>

        <div className="activity-stat-box">
          <div className="activity-stat-header">
            <Activity size={16} color="#FF9500" />
            <span>Process Count</span>
          </div>
          <div className="activity-stat-value">{processes.filter(p => p.status !== 'Terminated').length} active</div>
          <span className="activity-stat-sub">{processes.filter(p => p.status === 'Terminated').length} terminated</span>
        </div>
      </div>

      <div className="activity-toolbar">
        <input
          placeholder="Filter processes by name or PID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="activity-btn-refresh" onClick={() => setProcesses(INITIAL_PROCESSES)} title="Reset Processes">
          <RefreshCw size={13} /> Reset All
        </button>
      </div>

      <div className="activity-table-container">
        <table className="activity-table">
          <thead>
            <tr>
              <th>PID</th>
              <th>Process Name</th>
              <th>User</th>
              <th>Status</th>
              <th>CPU %</th>
              <th>Memory</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.pid} className={p.status === 'Terminated' ? 'row-terminated' : ''}>
                <td><b>{p.pid}</b></td>
                <td>
                  <span className="process-name-cell">
                    {p.protected && <Shield size={12} color="#FF9500" title="Core System Process" />}
                    {p.name}
                  </span>
                </td>
                <td><span className="user-badge">{p.user}</span></td>
                <td>
                  <span className={`status-pill ${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                </td>
                <td>{p.cpu}%</td>
                <td>{p.mem} MB</td>
                <td>
                  {p.status === 'Terminated' ? (
                    <button className="proc-action-btn restart" onClick={() => restartProcess(p.pid)}>
                      Restart
                    </button>
                  ) : (
                    <button
                      className="proc-action-btn kill"
                      onClick={() => killProcess(p.pid)}
                      disabled={p.protected}
                      title={p.protected ? 'Protected process' : 'End process'}
                    >
                      End Process
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityMonitorApp;
