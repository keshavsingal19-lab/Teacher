import React, { useState } from 'react';
import { TEACHERS } from '../functions/teacherData';

const teacherList = Object.entries(TEACHERS).map(([id, data]) => ({
    id,
    name: (data as any).name,
    department: (data as any).department
})).sort((a, b) => a.name.localeCompare(b.name));

interface LoginProps {
  onLoginSuccess: (data: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotTeacherId, setForgotTeacherId] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  // New state for the Searchable Dropdown
  const [teacherSearch, setTeacherSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const data = await res.json();

      if (data.success) {
         onLoginSuccess({ ...data.teacher, isAdmin: data.isAdmin, token: data.token });
      } else {
         setError(data.error || 'Invalid passcode');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
     e.preventDefault();
     setError('');
     setForgotMessage('');
     
     if (!forgotTeacherId) return setError('Please select your name from the search list.');
     
     // Frontend SRCC & VIP Bouncer
     const userEmail = forgotEmail.trim().toLowerCase();
     if (!userEmail.endsWith('@srcc.du.ac.in') && userEmail !== 'keshavsingal19@gmail.com') {
         return setError('Please use your official @srcc.du.ac.in email address.');
     }

     setIsLoading(true);
     try {
         const res = await fetch('/api/forgot_password', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ teacherId: forgotTeacherId, email: forgotEmail })
         });
         const data = await res.json();
         
         if (data.success) {
             setForgotMessage('If this email is valid, your temporary password has been sent! Check your inbox.');
             setForgotEmail('');
             setForgotTeacherId('');
             setTeacherSearch('');
             setTimeout(() => setIsForgotMode(false), 5000);
         } else {
             setError(data.error || 'Failed to process request');
         }
     } catch (err) {
         setError('Network error. Please try again.');
     } finally {
         setIsLoading(false);
     }
  }

  // Filter teachers based on what the user types
  const filteredTeachers = teacherList.filter(t => 
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) || 
      t.department.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-200 mb-4">
                <span className="text-white font-bold text-2xl">TA</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">TeacherAssist</h2>
            <p className="text-slate-500 text-sm mt-1">{isForgotMode ? "Reset your password" : "Enter your passcode to continue"}</p>
        </div>

        {error && <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg text-center border border-red-100">{error}</div>}
        {forgotMessage && <div className="mb-6 p-3 bg-green-50 text-green-700 text-sm font-medium rounded-lg text-center border border-green-100">{forgotMessage}</div>}

        {!isForgotMode ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="Passcode" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-center text-lg font-bold tracking-widest focus:ring-2 focus:ring-indigo-500 outline-none transition-all" autoFocus />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0">
                {isLoading ? 'Verifying...' : 'Access Dashboard'}
              </button>
              <div className="text-center mt-4">
                  <button type="button" onClick={() => { setIsForgotMode(true); setError(''); setForgotMessage(''); }} className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Forgot Password?</button>
              </div>
            </form>
        ) : (
            <form onSubmit={handleForgotPassword} className="space-y-5 relative">
                
                {/* Custom Searchable Dropdown */}
                <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Search Your Name</label>
                    <input 
                        type="text" 
                        value={teacherSearch}
                        onChange={(e) => {
                            setTeacherSearch(e.target.value);
                            setShowDropdown(true);
                            setForgotTeacherId(''); // Clear selection if they alter the name
                        }}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Slight delay so clicks register
                        placeholder="Type your name..."
                        className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                    
                    {showDropdown && filteredTeachers.length > 0 && (
                        <ul className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                            {filteredTeachers.map(t => (
                                <li 
                                    key={t.id} 
                                    onMouseDown={() => { 
                                        setForgotTeacherId(t.id);
                                        setTeacherSearch(`${t.name} (${t.department})`);
                                        setShowDropdown(false);
                                    }}
                                    className="px-4 py-3 hover:bg-indigo-50 cursor-pointer text-sm font-medium text-slate-700 border-b border-slate-50 last:border-0 transition-colors"
                                >
                                    {t.name} <span className="text-xs text-slate-400 ml-1">({t.department})</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Official Email Address</label>
                    <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="name@srcc.du.ac.in" className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                
                <div className="pt-2 flex flex-col gap-3">
                    <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-lg transition-all disabled:opacity-70">{isLoading ? 'Sending...' : 'Send Temporary Password'}</button>
                    <button type="button" onClick={() => { setIsForgotMode(false); setError(''); setForgotMessage(''); setTeacherSearch(''); setForgotTeacherId(''); }} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-3.5 rounded-xl font-bold transition-all">Back to Login</button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};