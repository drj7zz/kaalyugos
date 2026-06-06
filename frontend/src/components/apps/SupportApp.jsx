import React, { useState } from 'react';
import { HelpCircle, BookOpen, Command, ShieldCheck, Send, CheckCircle } from 'lucide-react';

const SHORTCUTS = [
  { key: 'Ctrl / Cmd + K', action: 'Spotlight Search — instantly search and launch any app' },
  { key: 'Ctrl / Cmd + L', action: 'Lock Screen — secure the system with your profile lock' },
  { key: 'Double Click Header', action: 'Maximize / Restore window size' },
  { key: 'Escape', action: 'Dismiss search overlays, notifications, or dialogs' },
  { key: 'Drag Window Header', action: 'Reposition window anywhere on the desktop' },
];

const SupportApp = () => {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setFeedback('');
      setEmail('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="os-app-content support-page">
      <h2 className="section-title"><HelpCircle size={22} color="#E056FD" /> Help & Documentation</h2>

      <div className="info-card">
        <h3><BookOpen size={18} /> Welcome to Kaalyug OS</h3>
        <p>
          Kaalyug OS is an interactive web-based operating system designed for productivity, exploration, and learning.
          All applications run in a unified window compositor with local persistence.
        </p>
      </div>

      <div className="info-card">
        <h3><Command size={18} /> Keyboard Shortcuts Cheat Sheet</h3>
        <div className="shortcuts-table">
          {SHORTCUTS.map((s, i) => (
            <div key={i} className="shortcut-row">
              <span className="shortcut-key-badge">{s.key}</span>
              <span className="shortcut-action-desc">{s.action}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3><ShieldCheck size={18} /> Offline Resiliency</h3>
          <p>
            Your documents, notes, virtual files, and user preferences are saved safely in your browser storage.
            You can write notes, run calculations, and use the terminal completely offline.
          </p>
        </div>

        <div className="info-card">
          <h3><HelpCircle size={18} /> System Diagnostics</h3>
          <p>
            Need to inspect running tasks or performance? Launch <b>Activity Monitor</b> or run <code>top</code> in the <b>Terminal</b>.
          </p>
        </div>
      </div>

      <div className="info-card">
        <h3>Feedback & Issue Reporting</h3>
        <p style={{ margin: '6px 0 12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Found a bug or have a feature idea for Kaalyug OS? Submit feedback to the core team:
        </p>
        {submitted ? (
          <div className="support-submitted-msg">
            <CheckCircle size={16} color="#30D158" />
            <span>Thank you! Your feedback has been recorded for the Kaalyug OS development team.</span>
          </div>
        ) : (
          <form className="support-feedback-form" onSubmit={handleSubmit}>
            <input
              placeholder="Your email (optional)"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <textarea
              required
              rows={4}
              placeholder="Describe what happened or request a feature..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
            />
            <button type="submit" className="finder-btn-primary">
              <Send size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              Submit Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SupportApp;
