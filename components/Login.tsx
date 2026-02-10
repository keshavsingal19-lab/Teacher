import React, { useState, useEffect } from 'react';

export const Login = ({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) => {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedCode = localStorage.getItem('teacherCode');
    const savedAdmin = localStorage.getItem('isAdmin');
    const savedToken = localStorage.getItem('adminToken');

    if (savedAdmin === 'true' && savedToken) {
        onLoginSuccess({ isAdmin: true, token: savedToken });
    } else if (savedCode) {
        attemptLogin(savedCode);
    }
  }, []);

  const attemptLogin = async (code: string) => {
    setLoading(true);
    setError('');

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passcode: code })
        });
        const data = await response.json();
        
        if (data.success) {
            if (data.isAdmin) {
                onLoginSuccess({ isAdmin: true, token: data.token });
            } else {
                onLoginSuccess(data.teacher);
            }
        } else {
            setError(data.error || 'Invalid credentials');
        }
    } catch (err) {
        setError('Connection failed. Please check your internet.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/50 z-10 relative">
        <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">TeacherAssist</h2>
            <p className="text-slate-500 mt-2 text-sm font-medium">Faculty Scheduling Companion</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); attemptLogin(passcode); }}>
            <div className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Access Code</label>
                    <input 
                      type="password" 
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-lg tracking-widest text-center"
                      placeholder="••••••••"
                    />
                </div>
                
                {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-red-600 text-sm font-medium">{error}</p>
                    </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:transform-none disabled:shadow-none"
                >
                  {loading ? (
                      <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Verifying...
                      </span>
                  ) : 'Sign In'}
                </button>
            </div>
        </form>
        <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">© 2025 SRCC Faculty Portal</p>
        </div>
      </div>
    </div>
  );
};