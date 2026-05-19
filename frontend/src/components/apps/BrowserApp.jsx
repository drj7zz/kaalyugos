import React, { useState } from 'react';
import { Globe, ArrowRight, RotateCw, ExternalLink, Bookmark } from 'lucide-react';

const QUICK_BOOKMARKS = [
  { title: 'Wikipedia', url: 'https://en.m.wikipedia.org' },
  { title: 'DuckDuckGo', url: 'https://duckduckgo.com' },
  { title: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
  { title: 'Hacker News', url: 'https://news.ycombinator.com' },
  { title: 'GitHub', url: 'https://github.com' },
];

const BrowserApp = () => {
  const [url, setUrl] = useState('https://en.m.wikipedia.org');
  const [inputVal, setInputVal] = useState('https://en.m.wikipedia.org');
  const [iframeKey, setIframeKey] = useState(0);

  const handleNavigate = (targetUrl) => {
    let clean = targetUrl.trim();
    if (!clean) return;
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      if (clean.includes('.') && !clean.includes(' ')) {
        clean = `https://${clean}`;
      } else {
        clean = `https://duckduckgo.com/?q=${encodeURIComponent(clean)}`;
      }
    }
    setUrl(clean);
    setInputVal(clean);
    setIframeKey(k => k + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNavigate(inputVal);
  };

  return (
    <div className="utility-app browser-app">
      <div className="browser-toolbar">
        <button
          className="browser-tool-btn"
          onClick={() => setIframeKey(k => k + 1)}
          title="Reload Page"
        >
          <RotateCw size={15} />
        </button>

        <form className="browser-url-bar" onSubmit={handleSubmit}>
          <Globe size={15} color="var(--text-muted)" />
          <input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Search the web or enter URL..."
            aria-label="Browser URL"
          />
          <button type="submit" title="Go">
            <ArrowRight size={14} />
          </button>
        </form>

        <button
          className="browser-tool-btn"
          onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
          title="Open in external browser window"
        >
          <ExternalLink size={15} />
        </button>
      </div>

      <div className="browser-bookmarks-bar">
        <Bookmark size={13} color="#0A84FF" />
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '4px' }}>Favorites:</span>
        {QUICK_BOOKMARKS.map(bm => (
          <button
            key={bm.title}
            className={`browser-bm-tag ${url.includes(bm.url.replace('https://', '')) ? 'active' : ''}`}
            onClick={() => handleNavigate(bm.url)}
          >
            {bm.title}
          </button>
        ))}
      </div>

      <div className="browser-frame-container">
        <iframe
          key={iframeKey}
          className="browser-frame"
          src={url}
          title="Kaalyug Web Browser"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
        <div className="browser-note">
          <span>Some external websites block embedded framing (X-Frame-Options). If a page does not load, click the</span>
          <button onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}>
            Open in new tab ↗
          </button>
          <span>button.</span>
        </div>
      </div>
    </div>
  );
};

export default BrowserApp;
