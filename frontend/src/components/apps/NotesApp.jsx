import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Plus, Trash2, Download, Eye, Edit3, FileText } from 'lucide-react';

const DEFAULT_NOTES = [
  {
    id: 'note-1',
    title: 'Welcome to Kaalyug OS.md',
    content: `# Welcome to Kaalyug OS 🚀\n\nKaalyug OS is an interactive web desktop environment.\n\n### Key Features:\n- **Window Compositor**: Drag, resize, minimize, and toggle fullscreen.\n- **POSIX Terminal**: Try commands like \`neofetch\`, \`top\`, \`ls\`, \`calc 42*7\`.\n- **Virtual File System**: Persistent file storage in your browser.\n- **Notes & Editor**: Write markdown notes with instant preview and download.\n- **Yug AI**: Native AI companion powered by Gemini.\n\n*Enjoy exploring your new web operating system!*`,
    updatedAt: new Date().toLocaleDateString(),
  },
  {
    id: 'note-2',
    title: 'System Tasks.txt',
    content: `[ ] Run neofetch in Terminal\n[ ] Try Spotlight Search (Ctrl+K)\n[ ] Customize theme in Settings\n[ ] Test scientific calculator\n[ ] Play retro Snake arcade`,
    updatedAt: new Date().toLocaleDateString(),
  },
];

const NotesApp = () => {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('kaalyug_notes');
      return saved ? JSON.parse(saved) : DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  });

  const [activeId, setActiveId] = useState(() => notes[0]?.id || 'note-1');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('kaalyug_notes', JSON.stringify(notes));
    } catch {
      // quota exceeded or private mode
    }
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeId) || notes[0];

  const updateActiveContent = (newContent) => {
    if (!activeNote) return;
    setNotes(prev => prev.map(n => n.id === activeNote.id ? { ...n, content: newContent, updatedAt: new Date().toLocaleDateString() } : n));
  };

  const updateActiveTitle = (newTitle) => {
    if (!activeNote) return;
    setNotes(prev => prev.map(n => n.id === activeNote.id ? { ...n, title: newTitle, updatedAt: new Date().toLocaleDateString() } : n));
  };

  const createNote = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      title: `Untitled Note ${notes.length + 1}.md`,
      content: `# New Document\n\nStart typing your note or code here...`,
      updatedAt: new Date().toLocaleDateString(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveId(newNote.id);
    setIsPreview(false);
  };

  const deleteNote = (id, e) => {
    e.stopPropagation();
    if (notes.length <= 1) {
      alert('You must keep at least one note.');
      return;
    }
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    if (activeId === id) setActiveId(remaining[0].id);
  };

  const downloadNote = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeNote.title.endsWith('.md') || activeNote.title.endsWith('.txt') ? activeNote.title : `${activeNote.title}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = activeNote?.content ? activeNote.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = activeNote?.content ? activeNote.content.length : 0;

  return (
    <div className="utility-app notes-app">
      <div className="notes-sidebar">
        <div className="notes-sidebar-header">
          <span>Documents</span>
          <button className="notes-btn-icon" onClick={createNote} title="New Note">
            <Plus size={16} />
          </button>
        </div>
        <div className="notes-list">
          {notes.map(note => (
            <div
              key={note.id}
              className={`notes-list-item ${note.id === activeId ? 'active' : ''}`}
              onClick={() => setActiveId(note.id)}
            >
              <div className="notes-item-title">
                <FileText size={14} />
                <span>{note.title}</span>
              </div>
              <div className="notes-item-meta">
                <span>{note.updatedAt}</span>
                <button
                  className="notes-item-delete"
                  onClick={(e) => deleteNote(note.id, e)}
                  title="Delete Note"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="notes-editor-pane">
        {activeNote ? (
          <>
            <div className="notes-toolbar">
              <input
                className="notes-title-input"
                value={activeNote.title}
                onChange={(e) => updateActiveTitle(e.target.value)}
                placeholder="Document Title"
              />
              <div className="notes-actions">
                <button
                  className={`notes-toolbar-btn ${isPreview ? 'active' : ''}`}
                  onClick={() => setIsPreview(!isPreview)}
                  title={isPreview ? 'Switch to Edit' : 'Markdown Preview'}
                >
                  {isPreview ? <Edit3 size={14} /> : <Eye size={14} />}
                  <span>{isPreview ? 'Edit' : 'Preview'}</span>
                </button>
                <button className="notes-toolbar-btn" onClick={downloadNote} title="Download File">
                  <Download size={14} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="notes-body">
              {isPreview ? (
                <div className="notes-markdown-preview">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {activeNote.content || '*Empty note*'}
                  </ReactMarkdown>
                </div>
              ) : (
                <textarea
                  className="notes-textarea"
                  value={activeNote.content}
                  onChange={(e) => updateActiveContent(e.target.value)}
                  placeholder="Type notes or markdown..."
                  autoFocus
                />
              )}
            </div>

            <div className="notes-footer">
              <span>{wordCount} words · {charCount} characters</span>
              <span>Saved locally</span>
            </div>
          </>
        ) : (
          <div className="notes-empty">No note selected</div>
        )}
      </div>
    </div>
  );
};

export default NotesApp;
