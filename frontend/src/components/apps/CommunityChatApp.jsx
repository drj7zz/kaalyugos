import React, { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';

const INITIAL_MESSAGES = [
  { user: 'SystemBot', text: 'Welcome to Kaalyug OS Community Hub! Say hello to other users.', time: 'System' },
  { user: 'DevKernel', text: 'Kaalyug OS 2.0 LTS is running smoothly. Love the terminal and window manager.', time: '10:24 AM' },
  { user: 'CyberExplorer', text: 'The liquid glass UI looks awesome on 4K display!', time: '11:05 AM' },
];

const CommunityChatApp = () => {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('kaalyug_community_messages');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [messageText, setMessageText] = useState('');

  const getUsername = () => {
    try {
      const acc = JSON.parse(localStorage.getItem('kaalyug_account'));
      return acc?.name || 'Administrator';
    } catch {
      return 'Administrator';
    }
  };

  const username = getUsername();

  useEffect(() => {
    const api = import.meta.env.VITE_API_BASE_URL;
    if (api) {
      fetch(`${api.replace(/\/api$/, '')}/api/messages`)
        .then(r => r.ok ? r.json() : [])
        .then(remoteMsgs => {
          if (Array.isArray(remoteMsgs) && remoteMsgs.length > 0) {
            setMessages(remoteMsgs);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMsg = {
      user: username,
      text: messageText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    setMessageText('');

    try {
      localStorage.setItem('kaalyug_community_messages', JSON.stringify(updated.slice(-50)));
    } catch {
      // ignore
    }

    const api = import.meta.env.VITE_API_BASE_URL;
    if (api) {
      fetch(`${api.replace(/\/api$/, '')}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg),
      }).catch(() => {});
    }
  };

  return (
    <div className="utility-app messages-app">
      <div className="chat-header-banner">
        <MessageCircle size={18} color="#007AFF" />
        <div>
          <b>Kaalyug Community Chat</b>
          <span>Connected global room · Signed in as <b>{username}</b></span>
        </div>
      </div>

      <div className="message-list">
        {messages.map((msg, idx) => {
          const isMe = msg.user.toLowerCase() === username.toLowerCase();
          return (
            <div key={idx} className={`message-bubble ${isMe ? 'msg-own' : ''}`}>
              <div className="message-bubble-header">
                <b>{msg.user}</b>
                {msg.time && <small>{msg.time}</small>}
              </div>
              <span className="message-bubble-text">{msg.text}</span>
            </div>
          );
        })}
      </div>

      <form className="message-compose" onSubmit={handleSend}>
        <input
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          placeholder="Send a message to the community..."
          autoFocus
        />
        <button type="submit" disabled={!messageText.trim()}>
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};

export default CommunityChatApp;
