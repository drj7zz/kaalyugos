import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, ArrowRight, Bot, User } from 'lucide-react';

const SUGGESTIONS = [
  'What features does Kaalyug OS have?',
  'What commands can I run in the Terminal?',
  'How do I create and manage notes and files?',
  'Explain the system architecture and compositor',
];

const OFFLINE_KNOWLEDGE = {
  features: `**Kaalyug OS 2.0 LTS** includes a full web operating system suite:
- **Liquid Glass Compositor**: Draggable, resizable, floating windows with minimize/maximize controls.
- **Files & Storage (VFS)**: Persistent browser-based virtual file system.
- **Notes & Editor**: Document editing with real-time markdown preview and file export.
- **Interactive Calculator**: Full standard & scientific calculations.
- **POSIX Shell Terminal**: Over 18 commands including \`neofetch\`, \`top\`, \`ls\`, \`cat\`, \`calc\`.
- **Activity Monitor**: Live CPU/RAM telemetry and process management.
- **Customizable Themes & Wallpapers**: Dark, Blue, and Pink glass styling.`,

  terminal: `The **Kaalyug Terminal** supports rich POSIX-like commands:
- \`neofetch\` — OS telemetry and ASCII art banner
- \`help\` — Complete command list
- \`ls\`, \`cat <file>\`, \`touch <file>\`, \`rm <file>\` — Virtual file operations
- \`calc <expr>\` — Calculate expressions (e.g. \`calc (25*4)/2\`)
- \`top\` or \`ps\` — Active process list
- \`open <app>\` — Launch any desktop app
- \`theme <dark|blue|pink>\` — Switch visual theme
- \`clear\`, \`date\`, \`whoami\`, \`uname -a\`, \`uptime\`, \`matrix\``,

  notes: `To manage files and notes:
1. Open the **Notes** app from the dock or search (Ctrl+K).
2. Click **+** to create a new markdown note.
3. Use the **Preview** button to view rendered markdown.
4. Click **Export** to save it directly to your physical computer as \`.md\`.
5. Open **Files & Storage** to explore all virtual system documents.`,

  architecture: `**Kaalyug OS Architecture:**
- **Frontend Engine**: React 19 + Vite 8
- **Compositor**: Liquid Glass CSS layer with dynamic z-index window management
- **Virtual Storage**: Browser-persisted Virtual File System (VFS)
- **AI Core**: Yug AI (integrated with Google Gemini)
- **Shell**: Native virtual POSIX command interpreter`,
};

const AiApp = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Greetings! I am **Yug AI**, the native intelligence core of Kaalyug OS. You can ask me about OS capabilities, system commands, coding in any programming language, or general questions.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const askAi = async (question) => {
    if (!question.trim()) return;
    const q = question.trim();
    setInputVal('');

    setMessages(prev => [
      ...prev,
      { role: 'user', text: q },
      { role: 'ai', text: '', isTyping: true },
    ]);
    setIsTyping(true);

    try {
      const api = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000/api';
      const cleanBase = api.replace(/\/api$/, '');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`${cleanBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const reply = data.answer || data.error || 'No response received.';
        setMessages(prev => [...prev.filter(m => !m.isTyping), { role: 'ai', text: reply }]);
        setIsTyping(false);
        return;
      }
      throw new Error('Backend unavailable');
    } catch {
      // Intelligent local offline reply
      const lower = q.toLowerCase();
      let fallbackAnswer = '';

      if (lower.includes('feature') || lower.includes('what can') || lower.includes('about os')) {
        fallbackAnswer = OFFLINE_KNOWLEDGE.features;
      } else if (lower.includes('terminal') || lower.includes('command') || lower.includes('shell')) {
        fallbackAnswer = OFFLINE_KNOWLEDGE.terminal;
      } else if (lower.includes('note') || lower.includes('file') || lower.includes('save')) {
        fallbackAnswer = OFFLINE_KNOWLEDGE.notes;
      } else if (lower.includes('arch') || lower.includes('system') || lower.includes('kernel')) {
        fallbackAnswer = OFFLINE_KNOWLEDGE.architecture;
      } else {
        fallbackAnswer = `**Yug AI (Local Core Mode):**\nI am currently operating in standalone local mode. I can answer questions about Kaalyug OS, its window manager, terminal commands, virtual storage, and apps.\n\n*Tip: Connect the backend with a Gemini API key for full generative cloud reasoning!*`;
      }

      setTimeout(() => {
        setMessages(prev => [...prev.filter(m => !m.isTyping), { role: 'ai', text: fallbackAnswer }]);
        setIsTyping(false);
      }, 400);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isTyping) askAi(inputVal);
  };

  return (
    <div className="utility-app ai-app">
      <div className="ai-app-header">
        <Sparkles size={18} color="#AF52DE" />
        <div>
          <b>Yug AI Core</b>
          <span>Native Operating System Assistant</span>
        </div>
      </div>

      <div className="ai-messages" id="ai-messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`ai-message ${msg.role}`}>
            <div className="ai-msg-avatar">
              {msg.role === 'ai' ? <Bot size={15} color="#AF52DE" /> : <User size={15} color="#fff" />}
            </div>
            <div className="ai-msg-bubble">
              {msg.isTyping ? (
                <span className="ai-typing-dots"><span /><span /><span /></span>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="ai-suggestions">
        {SUGGESTIONS.map((sug, i) => (
          <button key={i} className="ai-sug-chip" onClick={() => !isTyping && askAi(sug)}>
            {sug}
          </button>
        ))}
      </div>

      <form className="ai-form" onSubmit={handleSubmit}>
        <input
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Ask Yug AI anything..."
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping || !inputVal.trim()}>
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
};

export default AiApp;
