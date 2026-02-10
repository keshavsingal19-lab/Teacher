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
import { getTimeSlotIndex } from '../utils/roomData'; 
import { ClassCard } from './ClassCard';
import { RoomFinderModal } from './RoomFinderModal';
import { saveNoteToCloud, loadNotesFromCloud } from '../utils/db';
import { Utilities } from './Utilities';

interface DashboardProps {
  teacher: TeacherProfile;
  onLogout: () => void;
}

type ViewState = 'LIVE' | 'FULL_WEEK' | 'NOTES' | 'UTILITIES';

export const Dashboard: React.FC<DashboardProps> = ({ teacher, onLogout }) => {
  const [currentTime, setCurrentTime] = useState<string>(getFormattedTime());
  const [currentMinutes, setCurrentMinutes] = useState<number>(getCurrentMinutes());
  const [todayName, setTodayName] = useState<string>(getCurrentDayName());
  
  const [view, setView] = useState<ViewState>('LIVE');

  // Notes state
  const [notes, setNotes] = useState<ClassNote[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Edit Note State
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [noteText, setNoteText] = useState('');
  const [noteLink, setNoteLink] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(''); 
  const [upcomingDates, setUpcomingDates] = useState<Date[]>([]);
  
  // Delete Note State
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  // --- ROOM FINDER STATE ---
  const [isRoomFinderOpen, setIsRoomFinderOpen] = useState(false);
  const [finderInitialDay, setFinderInitialDay] = useState<string | undefined>(undefined);
  const [finderInitialTime, setFinderInitialTime] = useState<number | undefined>(undefined);

  // Load notes using Cloudflare D1
  useEffect(() => {
    let mounted = true;
    const loadNotes = async () => {
        setIsLoadingNotes(true);
        const storedCode = localStorage.getItem('teacherCode') || teacher.id;
        const rawData = await loadNotesFromCloud(storedCode);
        
        if (mounted) {
            const parsedNotes: ClassNote[] = rawData
                .map((row: any) => {
                    try {
                        return JSON.parse(row.content);
                    } catch (e) {
                        console.error('Failed to parse note', e);
                        return null;
                    }
                })
                .filter((n: any) => n !== null && !n.isDeleted);
            
            setNotes(parsedNotes);
            setIsLoadingNotes(false);
        }
    };
    loadNotes();
    return () => { mounted = false; };
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

  // --- HANDLERS ---

  const handleOpenRoomFinder = (session?: ClassSession) => {
      if (session) {
          // Contextual Open (from Class Card)
          setFinderInitialDay(session.day);
          setFinderInitialTime(getTimeSlotIndex(session.startTime));
      } else {
          // General Open (from Header)
          setFinderInitialDay(undefined);
          setFinderInitialTime(undefined);
      }
      setIsRoomFinderOpen(true);
  };

  const handleEditNote = (session: ClassSession) => {
    const dates = getUpcomingDates(session.day);
    setUpcomingDates(dates);
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

  const ensureProtocol = (url: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const handleSaveNote = async () => {
    if (!editingSession || !selectedDate) return;
    const otherNotes = notes.filter(n => !(n.sessionId === editingSession.id && n.targetDate === selectedDate));
    
    let updatedNotes = [...otherNotes];
    let newNote: ClassNote | null = null;
    
    if (noteText.trim() || noteLink.trim()) {
        newNote = {
            id: `${editingSession.id}_${selectedDate}`,
            sessionId: editingSession.id,
            targetDate: selectedDate,
            targetDateDisplay: toReadableDate(new Date(selectedDate)),
            day: editingSession.day,
            timeSlot: `${editingSession.startTime} - ${editingSession.endTime}`,
            batch: editingSession.batch,
            text: noteText,
            link: ensureProtocol(noteLink),
            createdAt: Date.now()
        };
        updatedNotes.push(newNote);
    }

    setNotes(updatedNotes); 
    setEditingSession(null);
    
    setIsSaving(true);
    const storedCode = localStorage.getItem('teacherCode') || teacher.id;
    if (newNote) {
        await saveNoteToCloud(storedCode, newNote.id, JSON.stringify(newNote));
    } else {
        const noteId = `${editingSession.id}_${selectedDate}`;
        await saveNoteToCloud(storedCode, noteId, JSON.stringify({ isDeleted: true }));
    }
    setIsSaving(false);
  };

  const requestDelete = (noteId: string) => {
    setDeletingNoteId(noteId);
  };

  const confirmDelete = async () => {
    if (deletingNoteId) {
        const noteToDelete = notes.find(n => n.id === deletingNoteId);
        const updatedNotes = notes.filter(n => n.id !== deletingNoteId);
        setNotes(updatedNotes); 
        setDeletingNoteId(null);
        
        if (noteToDelete) {
            setIsSaving(true);
            const storedCode = localStorage.getItem('teacherCode') || teacher.id;
            await saveNoteToCloud(storedCode, noteToDelete.id, JSON.stringify({ ...noteToDelete, isDeleted: true }));
            setIsSaving(false);
        }
    }
  };

  const cancelDelete = () => {
    setDeletingNoteId(null);
  };

  // Check for today's notes
  const todaysIsoDate = toISODate(new Date());
  const notesForToday = notes.filter(n => n.targetDate === todaysIsoDate);
  const todaysClasses = teacher.schedule[todayName] || [];
  
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
             onFindRoom={handleOpenRoomFinder} // Pass Handler
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
                                      <button onClick={() => handleEditNote(cls)} className="text-gray-400 hover:text-indigo-600 mr-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                      </button>
                                      {/* Added Find Room Button here too */}
                                      <button onClick={() => handleOpenRoomFinder(cls)} className="text-gray-400 hover:text-indigo-600">
                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
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
                          <button onClick={cancelDelete} className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold hover:bg-gray-200">Cancel</button>
                          <button onClick={confirmDelete} className="px-3 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600 shadow-sm">Yes, Delete</button>
                      </div>
                  </div>
              ) : null}

              <div className="pr-10 mb-2">
                 <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded mb-1">{note.targetDateDisplay}</span>
                 <h4 className="font-bold text-gray-800">{note.batch}</h4>
                 <p className="text-xs text-gray-500">{note.day} • {note.timeSlot}</p>
              </div>
              
              <button 
                 type="button"
                 onClick={(e) => { e.preventDefault(); e.stopPropagation(); requestDelete(note.id); }} 
                 className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
              >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>

              <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">{note.text}</div>
              {note.link && (
                 <a href={ensureProtocol(note.link)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-indigo-600 hover:underline">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    View Attachment
                 </a>
              )}
           </div>
        ))}
      </div>
    );
  };

  if (isLoadingNotes) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Syncing your schedule...</p>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12 relative">
      <header className="bg-white shadow-sm sticky top-0 z-40 transition-colors">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-800">{teacher.name}</h1>
            <p className="text-xs text-gray-500">{teacher.department}</p>
          </div>
          <div className="flex items-center gap-2">
             
             {/* RAISE DISCREPANCY BUTTON */}
             <a 
               href="mailto:abcddcba121202@gmail.com?subject=Discrepancy%20Report&body=My%20web-app%20has%20discrepancies.%20Kindly%20rectify%20it.%20(For%20faculty%3A%20Please%20send%20this%20mail%20from%20your%20official%20mail%20id%20and%20give%2048%20hours%20for%20rectification)"
               className="text-xs font-bold bg-orange-50 text-orange-700 px-3 py-2 rounded-lg hover:bg-orange-100 transition-colors flex items-center gap-1 no-underline"
               title="Report an issue with the schedule"
             >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span className="hidden sm:inline">Raise Discrepancy</span>
                <span className="sm:hidden">Report</span>
             </a>

             {/* GENERAL FIND ROOM BUTTON */}
             <button 
               onClick={() => handleOpenRoomFinder()}
               className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1"
             >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                Find Room
             </button>
             
             {isSaving && (
                 <span className="text-xs text-indigo-500 font-medium flex items-center gap-1 animate-pulse">
                    <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Sync...
                 </span>
             )}
             <button onClick={onLogout} className="text-sm text-red-500 hover:text-red-700 font-medium ml-1">Logout</button>
          </div>
        </div>
      </header>

      {/* --- IMPORTANT ALERTS SECTION --- */}
      {notesForToday.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 mt-6">
          <div className="space-y-3">
            {notesForToday.map((note) => (
              <div key={note.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm flex items-start justify-between animate-[fadeIn_0.5s_ease-out]">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold uppercase tracking-wider rounded-full">
                      Important
                    </span>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      {note.batch} • {note.timeSlot}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium text-sm mt-1">{note.text}</p>
                  
                  {note.link && (
                     <a href={note.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        View Attachment
                     </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{getFormattedDate()}</p>
            <h2 className="text-3xl font-bold text-gray-900">{todayName}</h2>
          </div>
          <div className="text-right">
             <p className="text-2xl font-mono font-medium text-indigo-600">{currentTime}</p>
          </div>
        </div>

        <div className="flex bg-gray-200 p-1 rounded-lg">
            <button onClick={() => setView('LIVE')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${view === 'LIVE' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Live View</button>
            <button onClick={() => setView('FULL_WEEK')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${view === 'FULL_WEEK' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Full Week</button>
            <button onClick={() => setView('NOTES')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${view === 'NOTES' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>My Notes</button>
            <button onClick={() => setView('UTILITIES')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${view === 'UTILITIES' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Utilities</button>
        </div>

        {view === 'LIVE' && (
            <>
                <section>
                {activeClass ? (
                    <ClassCard 
                        session={activeClass} 
                        status="active" 
                        isHero={true} 
                        onEditNote={handleEditNote}
                        onFindRoom={handleOpenRoomFinder} // Pass handler
                        hasNote={notes.some(n => n.sessionId === activeClass?.id)}
                    />
                ) : nextClass ? (
                    <ClassCard 
                        session={nextClass} 
                        status="upcoming" 
                        isHero={true} 
                        onEditNote={handleEditNote}
                        onFindRoom={handleOpenRoomFinder} // Pass handler
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

        {view === 'UTILITIES' && (
           <section className="animate-[fadeIn_0.2s_ease-out]">
              <div className="mb-4">
                  <h3 className="text-gray-500 font-semibold text-sm uppercase tracking-wider">Classroom Utilities</h3>
              </div>
              <Utilities teacher={teacher} />
           </section>
        )}

      </main>

      {/* Room Finder Modal */}
      <RoomFinderModal 
        isOpen={isRoomFinderOpen}
        onClose={() => setIsRoomFinderOpen(false)}
        initialDay={finderInitialDay}
        initialTimeIndex={finderInitialTime}
      />

      {/* Note Editor Modal (unchanged) */}
      {editingSession && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">Add/Edit Note</h3>
                    <button onClick={() => setEditingSession(null)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                {/* ... (rest of note editor) ... */}
                <div className="p-6 space-y-4">
                    <div className="text-sm text-gray-500 mb-2 border-b pb-2">
                        <p>Class: <span className="font-semibold text-gray-700">{editingSession.subject}</span></p>
                        <p>Time: <span className="font-semibold text-gray-700">{editingSession.startTime} - {editingSession.endTime}</span></p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 uppercase">Select Date</label>
                        <select value={selectedDate} onChange={handleDateChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                            {upcomingDates.map(date => (
                                <option key={toISODate(date)} value={toISODate(date)}>{toReadableDate(date)} ({editingSession.day})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 uppercase">Note Text</label>
                        <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]" placeholder="Add topics to cover, test reminders, etc..." />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 uppercase">Reference Link (Optional)</label>
                        <input type="url" value={noteLink} onChange={(e) => setNoteLink(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://..." />
                    </div>
                    <div className="pt-2 flex gap-3">
                        <button onClick={() => setEditingSession(null)} className="flex-1 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors">Cancel</button>
                        <button onClick={handleSaveNote} disabled={isSaving} className="flex-1 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors shadow-md disabled:bg-indigo-400">{isSaving ? 'Saving...' : 'Save Note'}</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};