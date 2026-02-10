import React from 'react';
import { ClassSession } from '../types';

interface ClassCardProps {
  session: ClassSession;
  status: 'active' | 'upcoming' | 'completed' | 'future';
  isHero?: boolean;
  onEditNote: (session: ClassSession) => void;
  onFindRoom: (session: ClassSession) => void;
  hasNote?: boolean;
}

export const ClassCard: React.FC<ClassCardProps> = ({ 
  session, 
  status, 
  isHero = false, 
  onEditNote, 
  onFindRoom,
  hasNote 
}) => {
  
  if (isHero) {
    return (
      <div className={`relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all duration-300 ${
          status === 'active' 
            ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white ring-4 ring-indigo-50 border-0' 
            : 'bg-white border border-slate-200'
      }`}>
        {/* Decorative background blob for active state */}
        {status === 'active' && (
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        )}

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        {status === 'active' ? (
                            <span className="flex h-2.5 w-2.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                            </span>
                        ) : (
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        )}
                        <p className={`text-xs font-bold uppercase tracking-widest ${status === 'active' ? 'text-indigo-100' : 'text-slate-500'}`}>
                            {status === 'active' ? 'Happening Now' : 'Up Next'}
                        </p>
                    </div>
                    <h2 className={`text-3xl font-extrabold tracking-tight ${status === 'active' ? 'text-white' : 'text-slate-800'}`}>
                        {session.startTime}
                    </h2>
                    <p className={`text-sm font-medium ${status === 'active' ? 'text-indigo-200' : 'text-slate-400'}`}>
                        Until {session.endTime}
                    </p>
                </div>
                
                <span className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide backdrop-blur-md ${
                    status === 'active' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                    {session.type}
                </span>
            </div>
            
            <div className={`p-4 rounded-xl backdrop-blur-sm border ${
                status === 'active' ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-100'
            }`}>
                <p className={`text-xs font-bold uppercase mb-1 ${status === 'active' ? 'text-indigo-200' : 'text-slate-400'}`}>Subject</p>
                <p className={`text-lg font-bold truncate ${status === 'active' ? 'text-white' : 'text-slate-800'}`}>{session.subject}</p>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div>
                        <p className={`text-[10px] font-bold uppercase ${status === 'active' ? 'text-indigo-200' : 'text-slate-400'}`}>Batch</p>
                        <p className={`font-semibold ${status === 'active' ? 'text-white' : 'text-slate-700'}`}>{session.batch}</p>
                    </div>
                    <div className="text-right">
                        <p className={`text-[10px] font-bold uppercase ${status === 'active' ? 'text-indigo-200' : 'text-slate-400'}`}>Location</p>
                        <p className={`text-2xl font-bold ${status === 'active' ? 'text-yellow-300' : 'text-indigo-600'}`}>{session.room}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
                <button 
                    onClick={(e) => { e.stopPropagation(); onEditNote(session); }}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                        status === 'active' 
                        ? (hasNote ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300' : 'bg-white text-indigo-700 hover:bg-indigo-50')
                        : (hasNote ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                    }`}
                >
                    {hasNote ? '✎ Edit Note' : '+ Add Note'}
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onFindRoom(session); }}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all ${
                        status === 'active'
                        ? 'bg-indigo-700/50 border-indigo-500/50 text-white hover:bg-indigo-700'
                        : 'bg-white border-slate-200 text-indigo-600 hover:bg-indigo-50'
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    Find Room
                </button>
            </div>
        </div>
      </div>
    );
  }

  // Standard Card Design
  return (
    <div className={`group bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 ${
        status === 'completed' ? 'opacity-60 grayscale' : ''
    }`}>
      <div className="flex gap-4">
        <div className="flex flex-col items-center min-w-[3.5rem]">
            <span className="text-xs font-bold text-slate-400 font-mono">{session.startTime.split(' ')[0]}</span>
            <div className="w-0.5 h-full bg-slate-100 my-1 rounded-full"></div>
            <span className="text-xs font-bold text-slate-300 font-mono">{session.endTime.split(' ')[0]}</span>
        </div>
        
        <div className="flex-1 pb-1">
            <div className="flex justify-between items-start mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    session.type === 'Lecture' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'
                }`}>
                    {session.type}
                </span>
                <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded text-sm">{session.room}</span>
            </div>
            
            <h3 className="font-bold text-slate-800 text-base mb-0.5">{session.subject}</h3>
            <p className="text-xs font-medium text-slate-500 mb-3">{session.batch}</p>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEditNote(session)} className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    hasNote ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                    {hasNote ? 'Note Added' : 'Add Note'}
                </button>
                <button onClick={() => onFindRoom(session)} className="text-xs px-3 py-1.5 rounded-lg font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                    Find Room
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};