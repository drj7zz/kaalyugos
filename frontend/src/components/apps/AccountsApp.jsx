import React, { useState } from 'react';
import { Users, User, LogOut, ShieldCheck, UserPlus, Check } from 'lucide-react';

const AccountsApp = () => {
  const [account, setAccount] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kaalyug_account')) || { name: 'Administrator', isGuest: false };
    } catch {
      return { name: 'Administrator', isGuest: false };
    }
  });

  const getAccounts = () => {
    try {
      return JSON.parse(localStorage.getItem('kaalyug_accounts')) || [
        { name: 'Administrator', role: 'System Admin' },
      ];
    } catch {
      return [{ name: 'Administrator', role: 'System Admin' }];
    }
  };

  const [accountsList, setAccountsList] = useState(getAccounts);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const saveAccount = (acc) => {
    setAccount(acc);
    localStorage.setItem('kaalyug_account', JSON.stringify(acc));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const name = newUsername.trim();
    if (!name || newPassword.length < 3) return;

    if (accountsList.some(a => a.name.toLowerCase() === name.toLowerCase())) {
      alert('An account with this name already exists.');
      return;
    }

    const updated = [...accountsList, { name, role: 'Standard User' }];
    setAccountsList(updated);
    localStorage.setItem('kaalyug_accounts', JSON.stringify(updated));
    saveAccount({ name, isGuest: false });
    setNewUsername('');
    setNewPassword('');
    setFeedbackMsg(`Account "${name}" created and signed in!`);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  return (
    <div className="utility-app accounts-app">
      <h2><Users size={20} /> User Accounts & Security</h2>

      <div className="info-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src="/avatar.svg"
            alt="User Avatar"
            width={48}
            height={48}
            style={{ borderRadius: '50%' }}
          />
          <div>
            <h3 style={{ margin: 0 }}>{account.name}</h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {account.isGuest ? 'Temporary Guest Session' : 'Active Kaalyug Profile'}
            </p>
          </div>
        </div>

        <div className="account-actions" style={{ marginTop: '16px' }}>
          {!account.isGuest ? (
            <button onClick={() => saveAccount({ name: 'Guest', isGuest: true })}>
              <LogOut size={14} /> Switch to Guest Mode
            </button>
          ) : (
            <button onClick={() => saveAccount({ name: 'Administrator', isGuest: false })}>
              <ShieldCheck size={14} /> Sign in as Administrator
            </button>
          )}
        </div>
      </div>

      <div className="info-card">
        <h3><UserPlus size={18} /> Create New User Profile</h3>
        <p style={{ margin: '6px 0 12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Create a dedicated profile to store personal documents and desktop preferences.
        </p>

        {feedbackMsg && (
          <div style={{ padding: '8px 12px', marginBottom: '12px', borderRadius: '8px', background: 'rgba(48,209,88,0.15)', color: '#30D158', fontSize: '13px' }}>
            <Check size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            {feedbackMsg}
          </div>
        )}

        <form className="account-form" onSubmit={handleCreate}>
          <input
            placeholder="Username (e.g. Alex, Developer)"
            required
            minLength={2}
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
          />
          <input
            placeholder="Password (min 3 characters)"
            type="password"
            required
            minLength={3}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <button type="submit">Create & Switch Account</button>
        </form>
      </div>

      {accountsList.length > 0 && (
        <div className="info-card">
          <h3>Saved Profiles (This Machine)</h3>
          <div className="account-list" style={{ marginTop: '10px' }}>
            {accountsList.map(a => (
              <div
                key={a.name}
                className={`social-link-row ${account.name === a.name ? 'active-profile-row' : ''}`}
                onClick={() => saveAccount({ name: a.name, isGuest: false })}
                style={{ cursor: 'pointer' }}
              >
                <div className="social-icon-box github-bg">
                  <User size={18} />
                </div>
                <div className="social-link-info">
                  <span className="social-name">{a.name}</span>
                  <span className="social-handle">{account.name === a.name ? '● Active Profile' : 'Click to switch'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsApp;
