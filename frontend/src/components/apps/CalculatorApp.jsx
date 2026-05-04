import React, { useState, useEffect, useCallback } from 'react';

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [showSci, setShowSci] = useState(false);

  const handleDigit = useCallback((digit) => {
    setDisplay(prev => {
      if (isNewNumber) {
        setIsNewNumber(false);
        return digit === '.' ? '0.' : digit;
      }
      if (digit === '.' && prev.includes('.')) return prev;
      return prev + digit;
    });
  }, [isNewNumber]);

  const handleOperator = useCallback((op) => {
    setEquation(`${display} ${op} `);
    setIsNewNumber(true);
  }, [display]);

  const handleEqual = useCallback(() => {
    if (!equation) return;
    try {
      const fullExpr = equation + display;
      // Sanitize expression: only allow numbers, spaces, and math operators
      const sanitized = fullExpr.replace(/×/g, '*').replace(/÷/g, '/');
      if (!/^[0-9+\-*/. ()%]+$/.test(sanitized)) {
        setDisplay('Error');
        setEquation('');
        setIsNewNumber(true);
        return;
      }
      // Safe evaluation using Function
      // eslint-disable-next-line no-new-func
      const result = Function(`'use strict'; return (${sanitized})`)();
      const formatted = Number.isFinite(result) ? String(parseFloat(result.toFixed(8))) : 'Error';
      setDisplay(formatted);
      setEquation('');
      setIsNewNumber(true);
    } catch {
      setDisplay('Error');
      setEquation('');
      setIsNewNumber(true);
    }
  }, [equation, display]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
  }, []);

  const handleBackspace = useCallback(() => {
    setDisplay(prev => {
      if (prev.length <= 1 || prev === 'Error') {
        setIsNewNumber(true);
        return '0';
      }
      return prev.slice(0, -1);
    });
  }, []);

  const handleNegate = useCallback(() => {
    setDisplay(prev => {
      if (prev === '0' || prev === 'Error') return prev;
      return prev.startsWith('-') ? prev.slice(1) : '-' + prev;
    });
  }, []);

  const handlePercent = useCallback(() => {
    setDisplay(prev => {
      const num = parseFloat(prev);
      return isNaN(num) ? '0' : String(num / 100);
    });
  }, []);

  const handleSci = useCallback((fn) => {
    const num = parseFloat(display);
    if (isNaN(num)) return;
    let res = 0;
    if (fn === 'sqrt') res = Math.sqrt(num);
    else if (fn === 'sq') res = Math.pow(num, 2);
    else if (fn === 'inv') res = num !== 0 ? 1 / num : 'Error';
    else if (fn === 'sin') res = Math.sin(num);
    else if (fn === 'cos') res = Math.cos(num);
    else if (fn === 'tan') res = Math.tan(num);
    else if (fn === 'pi') res = Math.PI;

    const formatted = typeof res === 'number' ? String(parseFloat(res.toFixed(8))) : 'Error';
    setDisplay(formatted);
    setIsNewNumber(true);
  }, [display]);

  // Keyboard support
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
      else if (e.key === '.') handleDigit('.');
      else if (e.key === '+') handleOperator('+');
      else if (e.key === '-') handleOperator('-');
      else if (e.key === '*') handleOperator('*');
      else if (e.key === '/') { e.preventDefault(); handleOperator('÷'); }
      else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); handleEqual(); }
      else if (e.key === 'Backspace') handleBackspace();
      else if (e.key === 'Escape') handleClear();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDigit, handleOperator, handleEqual, handleBackspace, handleClear]);

  return (
    <div className="utility-app calc-app">
      <div className="calc-header-bar">
        <button className={`calc-mode-toggle ${showSci ? 'active' : ''}`} onClick={() => setShowSci(!showSci)}>
          {showSci ? 'Standard View' : 'Scientific View'}
        </button>
      </div>

      <div className="calc-screen">
        <div className="calc-equation">{equation}</div>
        <div className="calc-display">{display}</div>
      </div>

      <div className={`calc-keys-grid ${showSci ? 'with-sci' : ''}`}>
        {showSci && (
          <>
            <button className="calc-btn sci" onClick={() => handleSci('sqrt')}>√x</button>
            <button className="calc-btn sci" onClick={() => handleSci('sq')}>x²</button>
            <button className="calc-btn sci" onClick={() => handleSci('inv')}>1/x</button>
            <button className="calc-btn sci" onClick={() => handleSci('pi')}>π</button>
            <button className="calc-btn sci" onClick={() => handleSci('sin')}>sin</button>
            <button className="calc-btn sci" onClick={() => handleSci('cos')}>cos</button>
            <button className="calc-btn sci" onClick={() => handleSci('tan')}>tan</button>
          </>
        )}

        <button className="calc-btn fn" onClick={handleClear}>AC</button>
        <button className="calc-btn fn" onClick={handleNegate}>±</button>
        <button className="calc-btn fn" onClick={handlePercent}>%</button>
        <button className="calc-btn op" onClick={() => handleOperator('÷')}>÷</button>

        <button className="calc-btn num" onClick={() => handleDigit('7')}>7</button>
        <button className="calc-btn num" onClick={() => handleDigit('8')}>8</button>
        <button className="calc-btn num" onClick={() => handleDigit('9')}>9</button>
        <button className="calc-btn op" onClick={() => handleOperator('×')}>×</button>

        <button className="calc-btn num" onClick={() => handleDigit('4')}>4</button>
        <button className="calc-btn num" onClick={() => handleDigit('5')}>5</button>
        <button className="calc-btn num" onClick={() => handleDigit('6')}>6</button>
        <button className="calc-btn op" onClick={() => handleOperator('-')}>−</button>

        <button className="calc-btn num" onClick={() => handleDigit('1')}>1</button>
        <button className="calc-btn num" onClick={() => handleDigit('2')}>2</button>
        <button className="calc-btn num" onClick={() => handleDigit('3')}>3</button>
        <button className="calc-btn op" onClick={() => handleOperator('+')}>+</button>

        <button className="calc-btn num span-2" onClick={() => handleDigit('0')}>0</button>
        <button className="calc-btn num" onClick={() => handleDigit('.')}>.</button>
        <button className="calc-btn eq" onClick={handleEqual}>=</button>
      </div>
    </div>
  );
};

export default CalculatorApp;
