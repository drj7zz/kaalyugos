import React, { useState, useEffect } from 'react';
import { Folder, FolderOpen, FileText, FileCode, HardDrive, Plus, Trash2, Eye, X, Download, Search } from 'lucide-react';

const INITIAL_VFS = [
  { id: '1', name: 'Kaalyug-User-Manual.md', path: '/Documents', size: '2.4 KB', type: 'doc', content: '# Kaalyug OS User Manual\n\nVersion: 2.0.0 LTS\n\n## Quick Start\n- Open apps from the bottom dock or search via Spotlight (Ctrl+K).\n- Use Terminal for command-line control.\n- Save notes in the Notes app; they persist locally.' },
  { id: '2', name: 'Architecture-Overview.txt', path: '/Documents', size: '1.8 KB', type: 'doc', content: 'Kaalyug OS Architecture:\n- Frontend: React 19 + Vite\n- Window Manager: Liquid Glass Compositor\n- VFS: LocalStorage persistent virtual storage\n- AI Engine: Yug AI Core' },
  { id: '3', name: 'kernel.sys', path: '/System', size: '512 B', type: 'sys', content: '[BOOT]\nkernel=Kaalyug-WebKernel-2.0\narch=x86_64\nmode=interactive\nvfs_mount=localStorage://kaalyug_vfs\ncompositor=liquid_glass' },
  { id: '4', name: 'hosts', path: '/System', size: '128 B', type: 'sys', content: '127.0.0.1 localhost\n::1 localhost\n0.0.0.0 telemetry.external' },
  { id: '5', name: 'wallpaper-info.json', path: '/Pictures', size: '340 B', type: 'img', content: '{\n  "current": "/bg.jpeg",\n  "title": "Cosmic Nebula",\n  "resolution": "3840x2160"\n}' },
  { id: '6', name: 'Sample-Package.tar', path: '/Downloads', size: '4.2 KB', type: 'bin', content: 'BINARY_ARCHIVE_DATA [Kaalyug Package Manifest v2.0]' },
];

const FileManagerApp = () => {
  const [vfs, setVfs] = useState(() => {
    try {
      const saved = localStorage.getItem('kaalyug_vfs');
      return saved ? JSON.parse(saved) : INITIAL_VFS;
    } catch {
      return INITIAL_VFS;
    }
  });

  const [currentFolder, setCurrentFolder] = useState('/Documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingFile, setViewingFile] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newFileContent, setNewFileContent] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('kaalyug_vfs', JSON.stringify(vfs));
    } catch {
      // ignore
    }
  }, [vfs]);

  const folders = ['/Documents', '/Downloads', '/Pictures', '/System'];

  const filteredFiles = vfs.filter(f => {
    const matchesFolder = searchQuery ? true : f.path === currentFolder;
    const matchesSearch = searchQuery ? f.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesFolder && matchesSearch;
  });

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this file?')) {
      setVfs(prev => prev.filter(f => f.id !== id));
      if (viewingFile?.id === id) setViewingFile(null);
    }
  };

  const handleCreateFile = (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const name = newFileName.trim();
    const newFile = {
      id: `file-${Date.now()}`,
      name,
      path: currentFolder,
      size: `${Math.max(1, Math.round(newFileContent.length / 1024 * 10) / 10)} KB`,
      type: name.endsWith('.sys') ? 'sys' : name.endsWith('.json') || name.endsWith('.js') ? 'code' : 'doc',
      content: newFileContent || `// ${name}\nCreated in Kaalyug OS VFS`,
    };
    setVfs(prev => [...prev, newFile]);
    setNewFileName('');
    setNewFileContent('');
    setShowNewModal(false);
  };

  const handleDownload = (file) => {
    const blob = new Blob([file.content || ''], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="utility-app finder-app">
      <div className="finder-toolbar">
        <FolderOpen size={18} />
        <b>Files</b>
        <span className="finder-path">Kaalyug OS {searchQuery ? '· Search' : currentFolder}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="finder-btn-action" onClick={() => setShowNewModal(true)} title="Create New File">
            <Plus size={14} /> New File
          </button>
          <div className="finder-search-box">
            <Search size={14} />
            <input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="finder-layout">
        <aside className="finder-sidebar">
          <b>Virtual Disks</b>
          <div className="finder-vfs-status">
            <HardDrive size={14} color="#0A84FF" />
            <span>Virtual Storage (50 MB)</span>
          </div>
          <b>Folders</b>
          {folders.map(folder => (
            <button
              key={folder}
              className={currentFolder === folder && !searchQuery ? 'active' : ''}
              onClick={() => { setCurrentFolder(folder); setSearchQuery(''); }}
            >
              <Folder size={15} />
              <span>{folder.replace('/', '')}</span>
            </button>
          ))}
        </aside>

        <div className="finder-table">
          <div className="finder-table-head">
            <span>Name</span>
            <span>Location</span>
            <span>Size</span>
            <span>Actions</span>
          </div>

          {filteredFiles.length === 0 ? (
            <div className="finder-empty">No files in this folder</div>
          ) : (
            filteredFiles.map(file => (
              <div
                key={file.id}
                className="finder-file-row"
                onClick={() => setViewingFile(file)}
              >
                <span className="finder-file-name">
                  {file.type === 'code' || file.type === 'sys' ? <FileCode size={16} color="#FF9500" /> : <FileText size={16} color="#0A84FF" />}
                  <b>{file.name}</b>
                </span>
                <span>{file.path}</span>
                <span>{file.size}</span>
                <span className="finder-file-actions">
                  <button onClick={(e) => { e.stopPropagation(); setViewingFile(file); }} title="View File">
                    <Eye size={13} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDownload(file); }} title="Export File">
                    <Download size={13} />
                  </button>
                  <button onClick={(e) => handleDelete(file.id, e)} title="Delete File" className="delete-btn">
                    <Trash2 size={13} />
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* File Viewer Modal */}
      {viewingFile && (
        <div className="finder-viewer-overlay" onClick={() => setViewingFile(null)}>
          <div className="finder-viewer-modal glass-panel" onClick={e => e.stopPropagation()}>
            <div className="finder-viewer-header">
              <b>{viewingFile.name}</b>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleDownload(viewingFile)}><Download size={14} /> Save</button>
                <button onClick={() => setViewingFile(null)}><X size={14} /></button>
              </div>
            </div>
            <pre className="finder-viewer-content">{viewingFile.content || '(Empty file)'}</pre>
          </div>
        </div>
      )}

      {/* Create File Modal */}
      {showNewModal && (
        <div className="finder-viewer-overlay" onClick={() => setShowNewModal(false)}>
          <form className="finder-viewer-modal glass-panel" onSubmit={handleCreateFile} onClick={e => e.stopPropagation()}>
            <div className="finder-viewer-header">
              <b>Create New File in {currentFolder}</b>
              <button type="button" onClick={() => setShowNewModal(false)}><X size={14} /></button>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                className="finder-input"
                required
                placeholder="Filename (e.g. script.js, notes.txt)"
                value={newFileName}
                onChange={e => setNewFileName(e.target.value)}
                autoFocus
              />
              <textarea
                className="finder-textarea"
                rows={6}
                placeholder="File contents..."
                value={newFileContent}
                onChange={e => setNewFileContent(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="finder-btn-secondary" onClick={() => setShowNewModal(false)}>Cancel</button>
                <button type="submit" className="finder-btn-primary">Create File</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FileManagerApp;
