import React, { useState, useEffect } from 'react';

export const Login = ({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) => {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedCode = localStorage.getItem('teacherCode');
    if (savedCode) {
        attemptLogin(savedCode);
    }
  }, []);

  const attemptLogin = async (code: string) => {
    setLoading(true);
    setError('');

    // --- 1. ADMIN CHECK ---
    if (code === 'ADMIN-SECRET-CODE') {
        setLoading(false);
        onLoginSuccess({ isAdmin: true });
        return;
    }

    // --- 2. REGULAR LOGIN ---
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passcode: code })
        });
        const data = await response.json();
        
        if (data.success) {
            onLoginSuccess(data.teacher);
        } else {
            setError(data.error);
        }
    } catch (err) {
        setError('Connection failed. Please check your internet.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Faculty Login</h2>
        <form onSubmit={(e) => { e.preventDefault(); attemptLogin(passcode); }}>
            <input 
              type="password" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter Access Code"
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
        </form>
      </div>
    </div>
  );
};