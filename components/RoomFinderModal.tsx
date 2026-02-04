import React, { useState, useEffect } from 'react';
import { 
  DayOfWeek, 
  TIME_SLOTS, 
  getAvailableRooms, 
  RoomData, 
  RoomType 
} from '../utils/roomData';

interface RoomFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDay?: string;
  initialTimeIndex?: number;
}

export const RoomFinderModal: React.FC<RoomFinderModalProps> = ({ 
  isOpen, 
  onClose, 
  initialDay, 
  initialTimeIndex 
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DayOfWeek.Monday);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number>(0);
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<RoomData[]>([]);

  // Reset or initialize state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialDay && Object.values(DayOfWeek).includes(initialDay as DayOfWeek)) {
        setSelectedDay(initialDay as DayOfWeek);
      } else {
        // Default to today if valid weekday
        const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        if (Object.values(DayOfWeek).includes(todayStr as DayOfWeek)) {
            setSelectedDay(todayStr as DayOfWeek);
        }
      }

      if (initialTimeIndex !== undefined && initialTimeIndex >= 0 && initialTimeIndex < TIME_SLOTS.length) {
        setSelectedTimeIndex(initialTimeIndex);
      }
    }
  }, [isOpen, initialDay, initialTimeIndex]);

  // Update results whenever filters change
  useEffect(() => {
    const available = getAvailableRooms(selectedDay, selectedTimeIndex, searchQuery, filterType);
    setResults(available);
  }, [selectedDay, selectedTimeIndex, searchQuery, filterType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-[fadeIn_0.2s_ease-out]">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <h3 className="font-bold text-lg">Empty Room Finder</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 space-y-3 bg-gray-50 border-b border-gray-200">
           <div className="grid grid-cols-2 gap-3">
              <div>
                 <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Day</label>
                 <select 
                   value={selectedDay}
                   onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                   className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                 >
                    {Object.values(DayOfWeek).map(day => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Time Slot</label>
                 <select 
                   value={selectedTimeIndex}
                   onChange={(e) => setSelectedTimeIndex(Number(e.target.value))}
                   className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                 >
                    {TIME_SLOTS.map((slot, idx) => (
                        <option key={idx} value={idx}>{slot}</option>
                    ))}
                 </select>
              </div>
           </div>

           <div className="flex gap-3">
              <div className="flex-1">
                 <input 
                   type="text" 
                   placeholder="Search (e.g. T4)" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
              </div>
              <select 
                 value={filterType}
                 onChange={(e) => setFilterType(e.target.value)}
                 className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                 <option value="All">All Types</option>
                 <option value="Lecture Hall">Lecture Hall</option>
                 <option value="Tutorial Room">Tutorial Room</option>
                 <option value="Lab">Lab</option>
                 <option value="Seminar Room">Seminar Room</option>
              </select>
           </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
           <p className="text-xs text-gray-500 mb-2 font-medium">Found {results.length} available rooms</p>
           
           {results.length === 0 ? (
               <div className="text-center py-10 text-gray-400">
                   <p>No rooms available matching your criteria.</p>
               </div>
           ) : (
               <div className="grid grid-cols-2 gap-3">
                   {results.map(room => (
                       <div key={room.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
                           <div className="flex justify-between items-start">
                               <span className="font-bold text-gray-800 text-lg">{room.name}</span>
                               <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                   room.type === 'Lecture Hall' ? 'bg-blue-100 text-blue-700' :
                                   room.type === 'Lab' ? 'bg-purple-100 text-purple-700' :
                                   room.type === 'Seminar Room' ? 'bg-orange-100 text-orange-700' :
                                   'bg-green-100 text-green-700'
                               }`}>
                                   {room.type}
                               </span>
                           </div>
                           <p className="text-xs text-gray-400 mt-1">Available now</p>
                       </div>
                   ))}
               </div>
           )}
        </div>
        
        <div className="p-4 bg-white border-t border-gray-100">
            <button 
                onClick={onClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg transition-colors"
            >
                Close
            </button>
        </div>

      </div>
    </div>
  );
};