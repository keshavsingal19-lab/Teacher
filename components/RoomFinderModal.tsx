import React, { useState, useEffect } from 'react';
import { getAvailableRooms, DayOfWeek, TIME_SLOTS, RoomSearchResult } from '../utils/roomData';
import { TeacherProfile } from '../types';

interface RoomFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDay?: string;
  initialTimeIndex?: number;
  absentTeacherIds?: string[];
  allTeachers?: Record<string, TeacherProfile>;
}

export const RoomFinderModal: React.FC<RoomFinderModalProps> = ({ 
  isOpen, onClose, initialDay, initialTimeIndex, 
  absentTeacherIds = [], allTeachers = {} 
}) => {
  const [selectedDay, setSelectedDay] = useState<string>(initialDay || 'Monday');
  const [selectedTime, setSelectedTime] = useState<number>(initialTimeIndex !== undefined ? initialTimeIndex : 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [rooms, setRooms] = useState<RoomSearchResult[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (initialDay) setSelectedDay(initialDay);
      if (initialTimeIndex !== undefined) setSelectedTime(initialTimeIndex);
    }
  }, [isOpen, initialDay, initialTimeIndex]);

  useEffect(() => {
    if (isOpen) {
      const day = selectedDay as DayOfWeek;
      const results = getAvailableRooms(
         day, 
         selectedTime, 
         searchQuery, 
         filterType,
         absentTeacherIds,
         allTeachers
      );
      setRooms(results);
    }
  }, [selectedDay, selectedTime, searchQuery, filterType, isOpen, absentTeacherIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <div>
              <h2 className="text-xl font-bold text-slate-800">Find Empty Room</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Locate available spaces instantly</p>
          </div>
          <button onClick={onClose} className="bg-slate-50 hover:bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        {/* Filters */}
        <div className="p-5 bg-slate-50/50 border-b border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Day</label>
            <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)} className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer hover:border-slate-300">
              {Object.values(DayOfWeek).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Time Slot</label>
            <select value={selectedTime} onChange={e => setSelectedTime(Number(e.target.value))} className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer hover:border-slate-300">
              {TIME_SLOTS.map((t, i) => <option key={i} value={i}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Room Type</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer hover:border-slate-300">
              <option value="All">All Types</option>
              <option value="Lab">Lab</option>
              <option value="Lecture Hall">Lecture Hall</option>
              <option value="Tutorial Room">Tutorial Room</option>
              <option value="Seminar Room">Seminar Room</option>
            </select>
          </div>
          <div>
             <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Search</label>
             <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="e.g. R21" className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-sm font-semibold text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm" />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50">
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {rooms.map(room => (
                 <div key={room.id} className={`p-4 rounded-xl shadow-sm border transition-all hover:shadow-md ${
                     room.isFreed 
                     ? 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-100' 
                     : 'bg-white border-slate-200 hover:border-indigo-200'
                 }`}>
                    {room.isFreed && (
                        <div className="flex items-center gap-1 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold uppercase text-emerald-600">Freed Up</span>
                        </div>
                    )}
                    <h3 className="font-extrabold text-slate-800 text-xl">{room.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{room.type}</p>
                 </div>
              ))}
              {rooms.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center text-slate-400 py-16">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="font-medium">No rooms available matching criteria.</p>
                </div>
              )}
           </div>
        </div>
        
        <div className="bg-white border-t border-slate-100 p-3 text-center">
            <p className="text-[10px] text-slate-400 font-medium">Showing {rooms.length} available rooms</p>
        </div>
      </div>
    </div>
  );
};