import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const SnakeApp = () => {
  const canvasRef = useRef(null);
  const snakeStateRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('kaalyug_snake_high') || '0', 10);
  });

  const resetGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gridSize = 20;
    const cols = Math.floor(canvas.width / gridSize);
    const rows = Math.floor(canvas.height / gridSize);

    snakeStateRef.current = {
      snake: [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }],
      dir: { x: 1, y: 0 },
      food: { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) },
      score: 0,
      speed: 120,
      gameOver: false,
      running: true,
      cols,
      rows,
      gridSize,
    };
    setScore(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const cols = Math.floor(canvas.width / gridSize);
    const rows = Math.floor(canvas.height / gridSize);

    const state = {
      snake: [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }],
      dir: { x: 1, y: 0 },
      food: { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) },
      score: 0,
      speed: 120,
      gameOver: false,
      running: true,
      cols,
      rows,
      gridSize,
    };
    snakeStateRef.current = state;

    const spawnFood = () => {
      state.food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    };

    const draw = () => {
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Food
      ctx.fillStyle = '#FF3B30';
      ctx.shadowBlur = 10; ctx.shadowColor = '#FF3B30';
      ctx.beginPath();
      ctx.arc(state.food.x * gridSize + gridSize / 2, state.food.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Snake
      state.snake.forEach((seg, i) => {
        const brightness = 1 - (i / state.snake.length) * 0.45;
        ctx.fillStyle = `rgba(48, 209, 88, ${brightness})`;
        ctx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2);
        if (i === 0) {
          ctx.fillStyle = '#fff';
          ctx.fillRect(seg.x * gridSize + 4, seg.y * gridSize + 4, 3, 3);
          ctx.fillRect(seg.x * gridSize + gridSize - 7, seg.y * gridSize + 4, 3, 3);
        }
      });

      if (state.gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '700 22px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '500 13px -apple-system, sans-serif';
        ctx.fillText(`Final Score: ${state.score} · Press Enter to restart`, canvas.width / 2, canvas.height / 2 + 18);
        ctx.textAlign = 'left';
      }
    };

    const tick = () => {
      if (state.gameOver || !state.running) return;
      const head = { x: state.snake[0].x + state.dir.x, y: state.snake[0].y + state.dir.y };

      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        state.gameOver = true;
        draw();
        return;
      }

      if (state.snake.some(s => s.x === head.x && s.y === head.y)) {
        state.gameOver = true;
        draw();
        return;
      }

      state.snake.unshift(head);
      if (head.x === state.food.x && head.y === state.food.y) {
        state.score += 10;
        setScore(state.score);
        setHighScore(prev => {
          const next = Math.max(prev, state.score);
          localStorage.setItem('kaalyug_snake_high', String(next));
          return next;
        });
        spawnFood();
        if (state.speed > 55) state.speed -= 3;
      } else {
        state.snake.pop();
      }
      draw();
    };

    let intervalId = setInterval(tick, state.speed);

    const handleKey = (e) => {
      if (state.gameOver && e.key === 'Enter') {
        resetGame();
        return;
      }
      const keyMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      };
      const newDir = keyMap[e.key];
      if (newDir && !(newDir.x === -state.dir.x && newDir.y === -state.dir.y)) {
        state.dir = newDir;
      }
    };

    window.addEventListener('keydown', handleKey);
    draw();

    return () => {
      state.running = false;
      clearInterval(intervalId);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const handleDpad = (dir) => {
    const s = snakeStateRef.current;
    if (!s) return;
    if (s.gameOver) {
      resetGame();
      return;
    }
    if (!(dir.x === -s.dir.x && dir.y === -s.dir.y)) {
      s.dir = dir;
    }
  };

  return (
    <div className="utility-app snake-app">
      <div className="snake-top-bar">
        <div className="snake-scores">
          <span>Score: <b>{score}</b></span>
          <span>Best: <b>{highScore}</b></span>
        </div>
        <button className="snake-reset-btn" onClick={resetGame}>
          <RotateCcw size={13} /> Restart
        </button>
      </div>

      <canvas ref={canvasRef} width={400} height={320} className="snake-canvas" />

      {/* Mobile D-pad */}
      <div className="snake-dpad">
        <button className="dpad-btn dpad-up" onPointerDown={() => handleDpad({ x: 0, y: -1 })}>
          <ArrowUp size={18} />
        </button>
        <div className="dpad-row">
          <button className="dpad-btn dpad-left" onPointerDown={() => handleDpad({ x: -1, y: 0 })}>
            <ArrowLeft size={18} />
          </button>
          <div className="dpad-center" />
          <button className="dpad-btn dpad-right" onPointerDown={() => handleDpad({ x: 1, y: 0 })}>
            <ArrowRight size={18} />
          </button>
        </div>
        <button className="dpad-btn dpad-down" onPointerDown={() => handleDpad({ x: 0, y: 1 })}>
          <ArrowDown size={18} />
        </button>
      </div>
    </div>
  );
};

export default SnakeApp;
