import React from 'react';
import { ClassSession } from '../types';

interface ClassCardProps {
  session: ClassSession;
  status: 'active' | 'upcoming' | 'completed' | 'future';
  isHero?: boolean;
  onEditNote: (session: ClassSession) => void;
  hasNote?: boolean;
}

export const ClassCard: React.FC<ClassCardProps> = ({ session, status, isHero = false, onEditNote, hasNote }) => {
  // Styles based on status
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'border-l-4 border-green-500 bg-green-50';
      case 'upcoming':
        return 'border-l-4 border-blue-500 bg-white';
      case 'completed':
        return 'border-l-4 border-gray-300 bg-gray-50 opacity-70';
      default:
        return 'border-l-4 border-indigo-200 bg-white';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-bold text-green-700 bg-green-200 rounded-full animate-pulse">HAPPENING NOW</span>;
      case 'upcoming':
        return <span className="px-2 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded-full">UP NEXT</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-bold text-gray-500 bg-gray-200 rounded-full">COMPLETED</span>;
      default:
        return null;
    }
  };

  const renderNoteButton = (isContrast = false) => (
    <button 
      onClick={(e) => { e.stopPropagation(); onEditNote(session); }}
      className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
        hasNote 
          ? (isContrast ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200')
          : (isContrast ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')
      }`}
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      {hasNote ? 'Edit Notes' : 'Add Note'}
    </button>
  );

  if (isHero) {
    return (
      <div className={`rounded-xl shadow-lg p-6 md:p-8 transition-all duration-300 ${status === 'active' ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white scale-105' : 'bg-white border border-gray-100'}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
               {status === 'active' && <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>}
               <p className={`text-sm font-semibold uppercase tracking-wider ${status === 'active' ? 'text-indigo-100' : 'text-gray-500'}`}>
                {status === 'active' ? 'Current Class' : 'Next Class'}
              </p>
            </div>
            <h2 className={`text-3xl font-bold ${status === 'active' ? 'text-white' : 'text-gray-800'}`}>
              {session.startTime} - {session.endTime}
            </h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={`px-3 py-1 rounded-lg text-sm font-medium ${status === 'active' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                {session.type}
            </div>
            {renderNoteButton(status === 'active')}
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className={`text-xs ${status === 'active' ? 'text-indigo-200' : 'text-gray-400'} uppercase`}>Subject</p>
            <p className={`text-xl font-medium ${status === 'active' ? 'text-white' : 'text-gray-800'}`}>{session.subject}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`text-xs ${status === 'active' ? 'text-indigo-200' : 'text-gray-400'} uppercase`}>Batch</p>
              <p className={`text-lg ${status === 'active' ? 'text-white' : 'text-gray-800'}`}>{session.batch}</p>
            </div>
            <div>
              <p className={`text-xs ${status === 'active' ? 'text-indigo-200' : 'text-gray-400'} uppercase`}>Room No.</p>
              <p className={`text-2xl font-bold ${status === 'active' ? 'text-yellow-300' : 'text-indigo-600'}`}>{session.room}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg shadow-sm mb-3 transition-colors ${getStatusStyles()}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
             <span className="text-sm font-semibold text-gray-500">{session.startTime} - {session.endTime}</span>
             {getStatusBadge()}
          </div>
          <h3 className="text-lg font-bold text-gray-800">{session.subject}</h3>
          <p className="text-sm text-gray-600">{session.batch} • {session.type}</p>
        </div>
        <div className="flex flex-col items-end justify-between h-full pl-4 gap-2">
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase">Room</p>
            <p className="text-xl font-bold text-indigo-600">{session.room}</p>
          </div>
          {renderNoteButton()}
        </div>
      </div>
    </div>
  );
};