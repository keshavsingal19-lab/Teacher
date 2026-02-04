import React, { useState } from 'react';
import { TEACHERS } from '../constants';
import { TeacherProfile } from '../types';

interface LoginProps {
  onLogin: (teacher: TeacherProfile) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPasscode = passcode.trim(); // Case sensitive as per IDs, or usually uppercase
    
    // Check if passcode exists in our constants
    // For better UX, we can try case-insensitive check
    const teacherKey = Object.keys(TEACHERS).find(k => k.toLowerCase() === normalizedPasscode.toLowerCase());
    
    if (teacherKey) {
      onLogin(TEACHERS[teacherKey]);
    } else {
      setError('Invalid Access Code. Please check your timetable footer.');
      setPasscode('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
             </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Faculty Portal</h1>
          <p className="text-indigo-100 mt-2 text-sm">Shri Ram College of Commerce</p>
        </div>
        
        <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Welcome Faculty</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Access Code</label>
                <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                placeholder=""
                autoFocus
                />
            </div>
            
            {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   {error}
                </div>
            )}

            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg transform active:scale-95 duration-150"
            >
                View My Timetable
            </button>
            </form>
        </div>
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400">Timetable 2025 - 2026</p>
        </div>
      </div>
    </div>
  );
};