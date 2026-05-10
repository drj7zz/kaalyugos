import React, { useState, useEffect, useRef } from 'react';

const BOOT_TIME = Date.now();

const ASCII_LOGO = `
  ██╗  ██╗ █████╗  █████╗ ██╗  ██╗   ██╗██╗   ██╗ ██████╗      ██████╗ ███████╗
  ██║ ██╔╝██╔══██╗██╔══██╗██║  ╚██╗ ██╔╝██║   ██║██╔════╝     ██╔═══██╗██╔════╝
  █████═╝ ███████║███████║██║   ╚████╔╝ ██║   ██║██║  ███╗    ██║   ██║███████╗
  ██╔═██╗ ██╔══██║██╔══██║██║    ╚██╔╝  ██║   ██║██║   ██║    ██║   ██║╚════██║
  ██║ ╚██╗██║  ██║██║  ██║███████╗██║   ╚██████╔╝╚██████╔╝    ╚██████╔╝███████║
  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝    ╚═════╝  ╚═════╝      ╚═════╝ ╚══════╝
`;

const TerminalApp = ({ onOpenApp, theme, setTheme }) => {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandInput, setCommandInput] = useState('');
  const [output, setOutput] = useState([
    'Kaalyug OS Kernel Terminal [Version 2.0.0-LTS]',
    'Type "help" for a list of built-in commands or "neofetch" for system telemetry.',
    '',
  ]);

  const outputEndRef = useRef(null);

  const getActiveUser = () => {
    try {
      const acc = JSON.parse(localStorage.getItem('kaalyug_account'));
      return acc?.name ? acc.name.toLowerCase().replace(/\s+/g, '_') : 'administrator';
    } catch {
      return 'administrator';
    }
  };

  const username = getActiveUser();

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const getVfs = () => {
    try {
      return JSON.parse(localStorage.getItem('kaalyug_vfs')) || [];
    } catch {
      return [];
    }
  };

  const saveVfs = (vfs) => {
    try {
      localStorage.setItem('kaalyug_vfs', JSON.stringify(vfs));
    } catch {
      // ignore
    }
  };

  const executeCommand = (cmdStr) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    setHistory(prev => [...prev, raw]);
    setHistoryIndex(-1);

    const promptLine = `${username}@kaalyug:~$ ${raw}`;
    const [cmd, ...args] = raw.split(' ');
    const argStr = args.join(' ');

    let result = '';

    switch (cmd.toLowerCase()) {
      case 'help':
        result = [
          'Kaalyug OS POSIX Shell — Built-in Commands:',
          '  neofetch             Show system specifications & ASCII banner',
          '  sysinfo              Display detailed OS kernel diagnostics',
          '  ls [folder]          List virtual files in current or target directory',
          '  cat <file>           Display virtual file contents',
          '  touch <file>         Create an empty virtual file in Documents',
          '  rm <file>            Delete a virtual file by name',
          '  pwd                  Print working directory',
          '  whoami               Display current user',
          '  uname -a             Print operating system & kernel architecture',
          '  uptime               Show system uptime',
          '  date                 Display current system timestamp',
          '  calc <expr>          Evaluate math expression (e.g. calc (100*4)/2)',
          '  top / ps             List active system tasks',
          '  open <app>           Launch an OS app (calc, notes, files, settings, etc.)',
          '  theme <dark|blue|pink> Switch OS color theme',
          '  echo <text>          Print text to standard output',
          '  matrix               Wake up to the Kaalyug matrix',
          '  clear                Clear the terminal screen',
          '  history              Show command history',
        ].join('\n');
        break;

      case 'neofetch': {
        const uptimeMins = Math.floor((Date.now() - BOOT_TIME) / 60000);
        result = [
          ASCII_LOGO,
          '-------------------------------------------------------',
          `  OS:         Kaalyug OS 2.0.0 LTS (WebKernel x86_64)`,
          `  Host:       Browser Virtual Machine`,
          `  Uptime:     ${uptimeMins} minutes`,
          `  Shell:      kaalyug-sh v2.0`,
          `  Terminal:   Kaalyug Glass Terminal`,
          `  Theme:      ${theme || 'dark'}`,
          `  Resolution: ${window.screen.width}x${window.screen.height}`,
          `  Memory:     2.4 GB / 8.0 GB (Allocated)`,
          `  User:       ${username}`,
          '-------------------------------------------------------',
        ].join('\n');
        break;
      }

      case 'sysinfo':
        result = 'Kaalyug OS 2.0.0 LTS (x86_64) | React 19 Engine | Liquid Glass Compositor | Online';
        break;

      case 'clear':
        setOutput([]);
        return;

      case 'pwd':
        result = `/home/${username}`;
        break;

      case 'whoami':
        result = username;
        break;

      case 'uname':
        result = args.includes('-a')
          ? 'KaalyugOS 2.0.0-generic #1 SMP PREEMPT WebKernel x86_64 GNU/Linux-Compatible'
          : 'KaalyugOS';
        break;

      case 'uptime': {
        const secs = Math.floor((Date.now() - BOOT_TIME) / 1000);
        const mins = Math.floor(secs / 60);
        result = `up ${mins} minutes, ${secs % 60} seconds, 1 user, load average: 0.14, 0.08, 0.02`;
        break;
      }

      case 'date':
        result = new Date().toString();
        break;

      case 'ls': {
        const vfs = getVfs();
        const targetFolder = argStr || '/Documents';
        const files = vfs.filter(f => f.path.toLowerCase().startsWith(targetFolder.toLowerCase()));
        if (files.length === 0) {
          result = `No files found in ${targetFolder}. (Available folders: /Documents, /Downloads, /Pictures, /System)`;
        } else {
          result = files.map(f => `${f.name.padEnd(28)} [${f.size}]  ${f.path}`).join('\n');
        }
        break;
      }

      case 'cat': {
        if (!argStr) {
          result = 'Usage: cat <filename>';
          break;
        }
        const vfs = getVfs();
        const found = vfs.find(f => f.name.toLowerCase() === argStr.toLowerCase());
        if (!found) {
          result = `cat: ${argStr}: No such file or directory`;
        } else {
          result = found.content || '(empty file)';
        }
        break;
      }

      case 'touch': {
        if (!argStr) {
          result = 'Usage: touch <filename>';
          break;
        }
        const vfs = getVfs();
        if (vfs.some(f => f.name.toLowerCase() === argStr.toLowerCase())) {
          result = `File '${argStr}' updated timestamp.`;
        } else {
          const newF = {
            id: `f-${Date.now()}`,
            name: argStr,
            path: '/Documents',
            size: '0 B',
            type: 'doc',
            content: '',
          };
          saveVfs([...vfs, newF]);
          result = `Created virtual file '${argStr}' in /Documents.`;
        }
        break;
      }

      case 'rm': {
        if (!argStr) {
          result = 'Usage: rm <filename>';
          break;
        }
        const vfs = getVfs();
        const nextVfs = vfs.filter(f => f.name.toLowerCase() !== argStr.toLowerCase());
        if (nextVfs.length === vfs.length) {
          result = `rm: cannot remove '${argStr}': No such file`;
        } else {
          saveVfs(nextVfs);
          result = `Removed '${argStr}'.`;
        }
        break;
      }

      case 'mkdir':
        result = argStr ? `Directory '${argStr}' created.` : 'Usage: mkdir <directory>';
        break;

      case 'calc': {
        if (!argStr) {
          result = 'Usage: calc <expression> (e.g. calc 24 * 7 + 12)';
          break;
        }
        try {
          if (!/^[0-9+\-*/. ()%]+$/.test(argStr)) {
            result = 'calc: invalid math expression';
            break;
          }
          // eslint-disable-next-line no-new-func
          const mathRes = Function(`'use strict'; return (${argStr})`)();
          result = String(mathRes);
        } catch (err) {
          result = `calc: error evaluating expression (${err.message})`;
        }
        break;
      }

      case 'top':
      case 'ps':
        result = [
          'PID   USER          PR  NI  VIRT   RES   %CPU  %MEM  COMMAND',
          '  1   root          20   0  180M   45M    3.8   1.2  kaalyug-compositor',
          '  2   root          20   0   95M   28M    2.1   0.8  window-manager',
          '104   system        20   0   48M   14M    0.5   0.4  vfs-daemon',
          '108   system        20   0  140M   60M    1.6   1.8  yug-ai-core',
          '210   user          20   0  110M   38M    1.4   1.1  browser-engine',
          '255   user          20   0   35M   12M    0.3   0.3  terminal-shell',
        ].join('\n');
        break;

      case 'theme': {
        const chosen = argStr.toLowerCase();
        if (['dark', 'blue', 'pink'].includes(chosen)) {
          if (setTheme) setTheme(chosen);
          result = `Theme set to '${chosen}'.`;
        } else {
          result = 'Usage: theme <dark|blue|pink>';
        }
        break;
      }

      case 'open': {
        const appMap = {
          calculator: { id: 'calculator', title: 'Calculator' },
          calc: { id: 'calculator', title: 'Calculator' },
          notes: { id: 'notes', title: 'Notes' },
          files: { id: 'finder', title: 'Files & Storage' },
          finder: { id: 'finder', title: 'Files & Storage' },
          browser: { id: 'browser', title: 'Browser' },
          web: { id: 'browser', title: 'Browser' },
          settings: { id: 'settings', title: 'Settings' },
          ai: { id: 'yug_ai', title: 'Yug AI' },
          'yug-ai': { id: 'yug_ai', title: 'Yug AI' },
          activity: { id: 'activity', title: 'Activity Monitor' },
          top: { id: 'activity', title: 'Activity Monitor' },
          sysinfo: { id: 'sysinfo', title: 'System Info' },
          snake: { id: 'snake', title: 'Arcade Snake' },
          accounts: { id: 'accounts', title: 'Accounts' },
          chat: { id: 'messages', title: 'Community Chat' },
          support: { id: 'support', title: 'Help & Docs' },
        };
        const target = appMap[argStr.toLowerCase()];
        if (target && onOpenApp) {
          onOpenApp(target);
          result = `Launching ${target.title}...`;
        } else {
          result = `App not recognized: '${argStr}'. Try: calc, notes, files, browser, settings, ai, activity, sysinfo, snake, chat, support`;
        }
        break;
      }

      case 'echo':
        result = argStr;
        break;

      case 'matrix':
        result = 'Wake up, user... The Kaalyug OS has you. Follow the white rabbit. 🐇\n[Matrix sub-protocol executed]';
        break;

      case 'history':
        result = history.map((h, i) => `${i + 1}  ${h}`).join('\n') || '(no history yet)';
        break;

      case 'reboot':
        setOutput(['[Rebooting Kaalyug Terminal Environment...]', 'Reboot complete.', '']);
        return;

      default:
        result = `Command not found: "${cmd}". Type "help" to see available commands.`;
        break;
    }

    setOutput(prev => [...prev, promptLine, ...(result ? [result] : [])]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(commandInput);
    setCommandInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setCommandInput(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setCommandInput('');
      } else {
        setHistoryIndex(nextIdx);
        setCommandInput(history[nextIdx] || '');
      }
    }
  };

  return (
    <div className="utility-app terminal-app">
      <div className="terminal-output">
        {output.map((line, idx) => (
          <div key={idx} className="terminal-line">{line}</div>
        ))}
        <div ref={outputEndRef} />
      </div>

      <form className="terminal-form" onSubmit={handleSubmit}>
        <span className="terminal-prompt">{username}@kaalyug:~$</span>
        <input
          value={commandInput}
          onChange={e => setCommandInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck="false"
          autoComplete="off"
          aria-label="Terminal command input"
        />
      </form>
    </div>
  );
};

export default TerminalApp;
