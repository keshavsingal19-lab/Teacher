import React, { useState, useEffect } from 'react';
import { TeacherProfile } from '../types';

export const Utilities: React.FC<{ teacher: TeacherProfile }> = ({ teacher }) => {
  const [activeTool, setActiveTool] = useState<'STOPWATCH' | 'TIMER' | 'GAMES' | 'SETTINGS'>('STOPWATCH');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
      {/* Utilities Navigation */}
      <div className="flex border-b border-gray-100 overflow-x-auto">
        <button 
          onClick={() => setActiveTool('STOPWATCH')}
          className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors ${activeTool === 'STOPWATCH' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Stopwatch
        </button>
        <button 
          onClick={() => setActiveTool('TIMER')}
          className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors ${activeTool === 'TIMER' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Timer
        </button>
        <button 
          onClick={() => setActiveTool('GAMES')}
          className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors ${activeTool === 'GAMES' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Games
        </button>
        <button 
          onClick={() => setActiveTool('SETTINGS')}
          className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors ${activeTool === 'SETTINGS' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Settings
        </button>
      </div>

      <div className="p-6 h-full flex flex-col items-center justify-center">
        {activeTool === 'STOPWATCH' && <Stopwatch />}
        {activeTool === 'TIMER' && <CountdownTimer />}
        {activeTool === 'GAMES' && <GamesMenu />}
        {activeTool === 'SETTINGS' && <SettingsMenu teacher={teacher} />}
      </div>
    </div>
  );
};

// --- Sub-Components ---

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => setTime((prev) => prev + 10), 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor((ms / 60000) % 60);
    const seconds = Math.floor((ms / 1000) % 60);
    const milliseconds = Math.floor((ms / 10) % 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center space-y-8">
      <div className="text-7xl font-mono font-bold text-gray-800 tracking-wider">
        {formatTime(time)}
      </div>
      <div className="flex gap-4 justify-center">
        <button onClick={() => setIsRunning(!isRunning)} className={`px-8 py-3 rounded-lg font-bold text-white shadow-md transition-transform active:scale-95 ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
          {isRunning ? 'STOP' : 'START'}
        </button>
        <button onClick={() => { setIsRunning(false); setTime(0); }} className="px-8 py-3 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
          RESET
        </button>
      </div>
    </div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(5);

  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      alert("Time is up!"); 
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setTimeLeft(inputMinutes * 60);
    setIsRunning(true);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isRunning) {
    return (
      <div className="text-center space-y-8">
        <div className={`text-8xl font-mono font-bold tracking-wider ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-gray-800'}`}>
          {formatSeconds(timeLeft)}
        </div>
        <button onClick={() => setIsRunning(false)} className="px-8 py-3 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">
          CANCEL
        </button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6 w-full max-w-xs">
      <div>
        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Set Duration (Minutes)</label>
        <input 
          type="number" 
          value={inputMinutes} 
          onChange={(e) => setInputMinutes(parseInt(e.target.value) || 0)}
          className="w-full text-center text-4xl font-bold border-2 border-indigo-100 rounded-xl py-4 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 5, 10, 15, 30, 45].map(m => (
          <button key={m} onClick={() => setInputMinutes(m)} className="py-2 bg-gray-50 rounded font-medium text-gray-600 hover:bg-gray-100">
            {m}m
          </button>
        ))}
      </div>
      <button onClick={startTimer} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all">
        START TIMER
      </button>
    </div>
  );
};

const GamesMenu = () => {
  const [game, setGame] = useState<'MENU' | 'TIC_TAC_TOE' | 'DICE'>('MENU');

  if (game === 'TIC_TAC_TOE') return <TicTacToe onBack={() => setGame('MENU')} />;
  if (game === 'DICE') return <DiceRoller onBack={() => setGame('MENU')} />;

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
      <button onClick={() => setGame('TIC_TAC_TOE')} className="aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform shadow-lg">
        <span className="text-4xl">❌⭕</span>
        <span className="font-bold text-lg">Tic Tac Toe</span>
      </button>
      <button onClick={() => setGame('DICE')} className="aspect-square bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform shadow-lg">
        <span className="text-4xl">🎲</span>
        <span className="font-bold text-lg">Dice Roll</span>
      </button>
    </div>
  );
};

// -- Settings Menu --
const SettingsMenu = ({ teacher }: { teacher: TeacherProfile }) => {
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [msg, setMsg] = useState('');

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('LOADING');
        setMsg('');

        try {
            const response = await fetch('/api/change_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    teacherId: teacher.id, 
                    currentPasscode: currentPass, 
                    newPasscode: newPass 
                })
            });
            const data = await response.json();
            
            if (response.ok && data.success) {
                setStatus('SUCCESS');
                setMsg('Password changed successfully! The old access code is now invalid.');
                setCurrentPass('');
                setNewPass('');
            } else {
                setStatus('ERROR');
                setMsg(data.error || 'Failed to change password');
            }
        } catch (error) {
            setStatus('ERROR');
            setMsg('Connection failed.');
        }
    };

    return (
        <div className="w-full max-w-sm bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 text-center">Change Access Code</h3>
            
            {status === 'SUCCESS' && <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded">{msg}</div>}
            {status === 'ERROR' && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded">{msg}</div>}

            <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Password</label>
                    <input 
                        type="password" 
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        className="w-full p-2 rounded border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Password</label>
                    <input 
                        type="password" 
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        className="w-full p-2 rounded border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        minLength={4}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={status === 'LOADING'}
                    className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                    {status === 'LOADING' ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    );
};

// -- Simple Games --

const TicTacToe = ({ onBack }: { onBack: () => void }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares: any[]) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);

  const handleClick = (i: number) => {
    if (calculateWinner(board) || board[i]) return;
    const next = [...board];
    next[i] = xIsNext ? "X" : "O";
    setBoard(next);
    setXIsNext(!xIsNext);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-between w-full items-center mb-2">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-sm font-bold uppercase">← Back</button>
        <span className="font-bold text-gray-800">{winner ? `Winner: ${winner}!` : isDraw ? "Draw!" : `Turn: ${xIsNext ? 'X' : 'O'}`}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 bg-gray-200 p-2 rounded-xl">
        {board.map((val, i) => (
          <button key={i} onClick={() => handleClick(i)} className="w-20 h-20 bg-white rounded-lg text-3xl font-bold text-indigo-600 flex items-center justify-center hover:bg-gray-50">
            {val}
          </button>
        ))}
      </div>
      <button onClick={() => setBoard(Array(9).fill(null))} className="text-sm text-indigo-600 font-bold hover:underline">Restart Game</button>
    </div>
  );
};

const DiceRoller = ({ onBack }: { onBack: () => void }) => {
  const [val, setVal] = useState(1);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    setRolling(true);
    const interval = setInterval(() => {
      setVal(Math.ceil(Math.random() * 6));
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      setVal(Math.ceil(Math.random() * 6));
      setRolling(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <button onClick={onBack} className="self-start text-gray-400 hover:text-gray-600 text-sm font-bold uppercase">← Back</button>
      <div onClick={roll} className={`w-32 h-32 bg-white border-4 border-gray-800 rounded-2xl flex items-center justify-center shadow-xl cursor-pointer transition-transform ${rolling ? 'animate-spin' : 'hover:rotate-12'}`}>
        <span className="text-6xl font-bold text-gray-800">{val}</span>
      </div>
      <button onClick={roll} disabled={rolling} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition-transform active:scale-95">
        ROLL DICE
      </button>
    </div>
  );
};