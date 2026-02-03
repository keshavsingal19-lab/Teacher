import React, { useState, useEffect } from 'react';
import { TeacherProfile, ClassSession, ClassNote } from '../types';
import { 
  getCurrentDayName, 
  getCurrentMinutes, 
  getFormattedDate, 
  getFormattedTime, 
  getClassStatus, 
  getUpcomingDates, 
  toISODate, 
  toReadableDate 
} from '../utils/timeUtils';
import { ClassCard } from './ClassCard';

interface DashboardProps {
  teacher: TeacherProfile;
  onLogout: () => void;
}

type ViewState = 'LIVE' | 'FULL_WEEK' | 'NOTES';

export const Dashboard: React.FC<DashboardProps> = ({ teacher, onLogout }) => {
  const [currentTime, setCurrentTime] = useState<string>(getFormattedTime());
  const [currentMinutes, setCurrentMinutes] = useState<number>(getCurrentMinutes());
  const [todayName, setTodayName] = useState<string>(getCurrentDayName());
  
  const [view, setView] = useState<ViewState>('LIVE');

  // Notes state
  const [notes, setNotes] = useState<ClassNote[]>([]);
  
  // Edit State
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [noteText, setNoteText] = useState('');
  const [noteLink, setNoteLink] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(''); // ISO String
  const [upcomingDates, setUpcomingDates] = useState<Date[]>([]);
  
  // Delete State (Custom UI instead of window.confirm)
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  // Load notes from local storage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${teacher.id}_v2`); // New key for array structure
    if (savedNotes) {
        try {
            const parsed = JSON.parse(savedNotes);
            if (Array.isArray(parsed)) {
              setNotes(parsed);
            }
        } catch (e) {
            console.error("Failed to parse notes", e);
        }
    }
  }, [teacher.id]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getFormattedTime());
      setCurrentMinutes(getCurrentMinutes());
      setTodayName(getCurrentDayName());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleEditNote = (session: ClassSession) => {
    const dates = getUpcomingDates(session.day);
    setUpcomingDates(dates);
    
    // Default to the first upcoming date
    if (dates.length > 0) {
        const defaultDate = toISODate(dates[0]);
        setSelectedDate(defaultDate);
        populateFormForDate(session.id, defaultDate);
    }
    setEditingSession(session);
  };

  const populateFormForDate = (sessionId: string, dateStr: string) => {
    const existing = notes.find(n => n.sessionId === sessionId && n.targetDate === dateStr);
    if (existing) {
      setNoteText(existing.text);
      setNoteLink(existing.link || '');
    } else {
      setNoteText('');
      setNoteLink('');
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    if (editingSession) {
      populateFormForDate(editingSession.id, newDate);
    }
  };

  const handleSaveNote = () => {
    if (!editingSession || !selectedDate) return;
    
    // Remove existing note for this session+date if it exists
    const otherNotes = notes.filter(n => !(n.sessionId === editingSession.id && n.targetDate === selectedDate));
    
    let updatedNotes = [...otherNotes];
    
    if (noteText.trim() || noteLink.trim()) {
        const newNote: ClassNote = {
            id: `${editingSession.id}_${selectedDate}`,
            sessionId: editingSession.id,
            targetDate: selectedDate,
            targetDateDisplay: toReadableDate(new Date(selectedDate)),
            day: editingSession.day,
            timeSlot: `${editingSession.startTime} - ${editingSession.endTime}`,
            batch: editingSession.batch,
            text: noteText,
            link: noteLink,
            createdAt: Date.now()
        };
        updatedNotes.push(newNote);
    }

    setNotes(updatedNotes);
    localStorage.setItem(`notes_${teacher.id}_v2`, JSON.stringify(updatedNotes));
    setEditingSession(null);
  };

  const requestDelete = (noteId: string) => {
    setDeletingNoteId(noteId);
  };

  const confirmDelete = () => {
    if (deletingNoteId) {
        const updatedNotes = notes.filter(n => n.id !== deletingNoteId);
        setNotes(updatedNotes);
        localStorage.setItem(`notes_${teacher.id}_v2`, JSON.stringify(updatedNotes));
        setDeletingNoteId(null);
    }
  };

  const cancelDelete = () => {
    setDeletingNoteId(null);
  };

  // Check for today's notes
  const todaysIsoDate = toISODate(new Date());
  const notesForToday = notes.filter(n => n.targetDate === todaysIsoDate);

  const todaysClasses = teacher.schedule[todayName] || [];
  
  // Logic to find active and next classes
  let activeClass: ClassSession | null = null;
  let nextClass: ClassSession | null = null;
  
  const sortedClasses = [...todaysClasses].sort((a, b) => a.rawTimeStart - b.rawTimeStart);

  for (const session of sortedClasses) {
    const status = getClassStatus(session, currentMinutes);
    if (status === 'active') {
      activeClass = session;
    } else if (status === 'upcoming' && !nextClass) {
      nextClass = session;
    }
  }

  const renderTimeline = () => {
    if (todaysClasses.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-lg">No classes scheduled for today.</p>
          <p className="text-gray-400 text-sm">Enjoy your day off!</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {sortedClasses.map((session) => (
           <ClassCard 
             key={session.id} 
             session={session} 
             status={getClassStatus(session, currentMinutes) as any} 
             onEditNote={handleEditNote}
             hasNote={notes.some(n => n.sessionId === session.id && new Date(n.targetDate) >= new Date(todaysIsoDate))}
           />
        ))}
      </div>
    );
  };

  const renderFullWeek = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return (
        <div className="space-y-6">
            {days.map(day => (
                <div key={day} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 border-b pb-2 mb-3 text-lg">{day}</h3>
                    {teacher.schedule[day] && teacher.schedule[day].length > 0 ? (
                        <div className="space-y-2">
                            {teacher.schedule[day].map(cls => (
                                <div key={cls.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                                    <span className="font-medium text-gray-700 w-24">{cls.startTime}</span>
                                    <div className="flex-1 px-4">
                                        <div className="font-semibold text-gray-800">{cls.subject}</div>
                                        <div className="text-xs text-gray-500">{cls.batch}</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{cls.room}</span>
                                      <button onClick={() => handleEditNote(cls)} className="text-gray-400 hover:text-indigo-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                      </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 italic text-sm">No classes.</p>
                    )}
                </div>
            ))}
        </div>
    )
  }

  const renderNotesView = () => {
    const sortedNotes = [...notes].sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());

    if (sortedNotes.length === 0) {
      return (
        <div className="text-center py-16 bg-white rounded-xl">
           <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
           </div>
           <h3 className="text-lg font-medium text-gray-900">No notes yet</h3>
           <p className="text-gray-500 mt-1">Add notes to your classes to see them here.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {sortedNotes.map(note => (
           <div key={note.id} className="bg-white rounded-lg border-l-4 border-yellow-400 shadow-sm p-4 relative min-h-[100px] overflow-hidden">
              {deletingNoteId === note.id ? (
                  <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center animate-[fadeIn_0.2s_ease-out]">
                      <p className="text-gray-800 font-medium text-sm mb-3">Delete this note?</p>
                      <div className="flex gap-3">
                          <button 
                            onClick={cancelDelete}
                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={confirmDelete}
                            className="px-3 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600 shadow-sm"
                          >
                            Yes, Delete
                          </button>
                      </div>
                  </div>
              ) : null}

              <div className="pr-10 mb-2">
                 <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded mb-1">
                   {note.targetDateDisplay}
                 </span>
                 <h4 className="font-bold text-gray-800">{note.batch}</h4>
                 <p className="text-xs text-gray-500">{note.day} • {note.timeSlot}</p>
              </div>
              
              {/* Absolute positioning for delete button */}
              <button 
                 type="button"
                 onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     requestDelete(note.id);
                 }} 
                 className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                 title="Delete Note"
              >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>

              <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  {note.text}
              </div>
              {note.link && (
                 <a href={note.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-indigo-600 hover:underline">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    View Attachment
                 </a>
              )}
           </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 relative">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-800">{teacher.name}</h1>
            <p className="text-xs text-gray-500">{teacher.department}</p>
          </div>
          <button 
            onClick={onLogout}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* High Priority Alerts (Today's Notes) */}
      {notesForToday.length > 0 && (
          <div className="bg-yellow-50 border-b border-yellow-100 px-4 py-3">
             <div className="max-w-3xl mx-auto">
                <h3 className="flex items-center gap-2 text-sm font-bold text-yellow-800 uppercase tracking-wide mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    Important for Today
                </h3>
                <div className="space-y-2">
                    {notesForToday.map(note => (
                        <div key={note.id} className="relative bg-white p-2 rounded border border-yellow-200 shadow-sm overflow-hidden">
                            {deletingNoteId === note.id ? (
                                <div className="absolute inset-0 bg-white z-20 flex items-center justify-between px-3 animate-[fadeIn_0.2s_ease-out]">
                                    <span className="text-xs font-bold text-gray-800">Delete?</span>
                                    <div className="flex gap-2">
                                        <button onClick={cancelDelete} className="text-xs text-gray-500 underline">Cancel</button>
                                        <button onClick={confirmDelete} className="text-xs bg-red-500 text-white px-2 py-1 rounded">Yes</button>
                                    </div>
                                </div>
                            ) : null}
                            <div className="flex justify-between items-center">
                                <div className="flex gap-3 items-center">
                                    <div className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded h-fit whitespace-nowrap">
                                        {note.timeSlot.split('-')[0].trim()}
                                    </div>
                                    <div className="text-sm text-gray-800">
                                        <span className="font-semibold">{note.batch}:</span> {note.text}
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        requestDelete(note.id);
                                    }} 
                                    className="text-gray-300 hover:text-red-500 ml-2 p-1"
                                    title="Dismiss"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
          </div>
      )}

      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Date/Time Banner */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{getFormattedDate()}</p>
            <h2 className="text-3xl font-bold text-gray-900">{todayName}</h2>
          </div>
          <div className="text-right">
             <p className="text-2xl font-mono font-medium text-indigo-600">{currentTime}</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-200 p-1 rounded-lg">
            <button 
                onClick={() => setView('LIVE')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${view === 'LIVE' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Live View
            </button>
            <button 
                onClick={() => setView('FULL_WEEK')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${view === 'FULL_WEEK' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Full Week
            </button>
            <button 
                onClick={() => setView('NOTES')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${view === 'NOTES' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                My Notes
            </button>
        </div>

        {view === 'LIVE' && (
            <>
                {/* Hero Card: Active or Next Class */}
                <section>
                {activeClass ? (
                    <ClassCard 
                        session={activeClass} 
                        status="active" 
                        isHero={true} 
                        onEditNote={handleEditNote}
                        hasNote={notes.some(n => n.sessionId === activeClass?.id)}
                    />
                ) : nextClass ? (
                    <ClassCard 
                        session={nextClass} 
                        status="upcoming" 
                        isHero={true} 
                        onEditNote={handleEditNote}
                        hasNote={notes.some(n => n.sessionId === nextClass?.id)}
                    />
                ) : (
                    <div className="rounded-xl shadow-lg p-8 bg-gradient-to-br from-gray-700 to-gray-900 text-white text-center">
                    <h2 className="text-2xl font-bold mb-2">You're all done!</h2>
                    <p className="text-gray-300">No more classes scheduled for today.</p>
                    <p className="mt-4 text-sm opacity-50">Check the full schedule for tomorrow.</p>
                    </div>
                )}
                </section>

                {/* Rest of the Timeline */}
                <section>
                <h3 className="text-gray-500 font-semibold mb-4 text-sm uppercase tracking-wider">Today's Schedule</h3>
                {renderTimeline()}
                </section>
            </>
        )}

        {view === 'FULL_WEEK' && renderFullWeek()}

        {view === 'NOTES' && (
            <section>
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-gray-500 font-semibold text-sm uppercase tracking-wider">All Saved Notes</h3>
                </div>
                {renderNotesView()}
            </section>
        )}

      </main>

      {/* Note Editor Modal */}
      {editingSession && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">Add/Edit Note</h3>
                    <button onClick={() => setEditingSession(null)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="text-sm text-gray-500 mb-2 border-b pb-2">
                        <p>Class: <span className="font-semibold text-gray-700">{editingSession.subject}</span></p>
                        <p>Time: <span className="font-semibold text-gray-700">{editingSession.startTime} - {editingSession.endTime}</span></p>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 uppercase">Select Date</label>
                        <select 
                            value={selectedDate} 
                            onChange={handleDateChange}
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        >
                            {upcomingDates.map(date => (
                                <option key={toISODate(date)} value={toISODate(date)}>
                                    {toReadableDate(date)} ({editingSession.day})
                                </option>
                            ))}
                        </select>
                        <p className="text-[10px] text-gray-400 mt-1">Showing upcoming {editingSession.day}s</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 uppercase">Note Text</label>
                        <textarea 
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                            placeholder="Add topics to cover, test reminders, etc..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 uppercase">Reference Link (Optional)</label>
                        <input 
                            type="url"
                            value={noteLink}
                            onChange={(e) => setNoteLink(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="https://..."
                        />
                    </div>
                    <div className="pt-2 flex gap-3">
                        <button 
                            onClick={() => setEditingSession(null)}
                            className="flex-1 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSaveNote}
                            className="flex-1 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors shadow-md"
                        >
                            Save Note
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};