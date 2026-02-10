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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Find Empty Room</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-4 grid grid-cols-2 gap-4 bg-white">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Day</label>
            <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              {Object.values(DayOfWeek).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Time</label>
            <select value={selectedTime} onChange={e => setSelectedTime(Number(e.target.value))} className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              {TIME_SLOTS.map((t, i) => <option key={i} value={i}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Filter</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="All">All Types</option>
              <option value="Lab">Lab</option>
              <option value="Lecture Hall">Lecture Hall</option>
              <option value="Tutorial Room">Tutorial Room</option>
              <option value="Seminar Room">Seminar Room</option>
            </select>
          </div>
          <div>
             <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Search</label>
             <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Room Name..." className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {rooms.map(room => (
                 <div key={room.id} className={`p-3 rounded-lg shadow-sm border relative ${room.isFreed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                    {room.isFreed && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-green-200 text-green-800 text-[10px] font-bold uppercase rounded">Freed</span>
                    )}
                    <h3 className="font-bold text-gray-800 text-lg">{room.name}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{room.type}</p>
                 </div>
              ))}
              {rooms.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-12">
                    <p>No rooms available for this slot.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};