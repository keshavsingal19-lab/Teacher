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
  allTeachers: Record<string, TeacherProfile>;
}

type ViewState = 'LIVE' | 'FULL_WEEK' | 'NOTES' | 'UTILITIES';

export const Dashboard: React.FC<DashboardProps> = ({ teacher, onLogout, allTeachers }) => {
  const [currentTime, setCurrentTime] = useState<string>(getFormattedTime());
  const [currentMinutes, setCurrentMinutes] = useState<number>(getCurrentMinutes());
  const [todayName, setTodayName] = useState<string>(getCurrentDayName());
  
  const [view, setView] = useState<ViewState>('LIVE');
  const [absentTeachers, setAbsentTeachers] = useState<string[]>([]);

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

  // Load Absences
  useEffect(() => {
    fetch('/api/absences')
      .then(r => r.json())
      .then(d => {
         if(d.success) setAbsentTeachers(d.absentIds);
      });
  }, []);

  // Load notes
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

  // Update time
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
          setFinderInitialDay(session.day);
          setFinderInitialTime(getTimeSlotIndex(session.startTime));
      } else {
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

  const handleShareNote = (note: ClassNote) => {
    let subject = '';
    if (teacher.schedule[note.day]) {
        const session = teacher.schedule[note.day].find(s => s.id === note.sessionId);
        if (session) subject = session.subject;
    }
    const textLines = [
        `📢 *Note for ${note.batch}* ${subject ? `(${subject})` : ''}`,
        `📅 ${note.targetDateDisplay} (${note.day})`,
        `⏰ ${note.timeSlot}`,
        ``,
        `📝 *Message:*`,
        `${note.text}`,
        note.link ? `\n🔗 *Link:* ${note.link}` : ''
    ];
    const message = textLines.join('\n');
    const encodedText = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(url, '_blank');
  };

  const requestDelete = (noteId: string) => setDeletingNoteId(noteId);
  const cancelDelete = () => setDeletingNoteId(null);
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

  // Timeline Logic
  const todaysIsoDate = toISODate(new Date());
  const notesForToday = notes.filter(n => n.targetDate === todaysIsoDate);
  const todaysClasses = teacher.schedule[todayName] || [];
  let activeClass: ClassSession | null = null;
  let nextClass: ClassSession | null = null;
  const sortedClasses = [...todaysClasses].sort((a, b) => a.rawTimeStart - b.rawTimeStart);

  for (const session of sortedClasses) {
    const status = getClassStatus(session, currentMinutes);
    if (status === 'active') activeClass = session;
    else if (status === 'upcoming' && !nextClass) nextClass = session;
  }

  // Render Helpers
  const renderTimeline = () => {
    if (todaysClasses.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">No classes scheduled for today.</p>
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
             onFindRoom={handleOpenRoomFinder}
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
                                      <button onClick={() => handleEditNote(cls)} className="text-gray-400 hover:text-indigo-600 mr-2">✏️</button>
                                      <button onClick={() => handleOpenRoomFinder(cls)} className="text-gray-400 hover:text-indigo-600">🔍</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-400 italic text-sm">No classes.</p>}
                </div>
            ))}
        </div>
    )
  }

  const renderNotesView = () => {
    const sortedNotes = [...notes].sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
    if (sortedNotes.length === 0) return <div className="text-center py-16 bg-white rounded-xl"><p>No notes yet.</p></div>;
    return (
      <div className="space-y-4">
        {sortedNotes.map(note => (
           <div key={note.id} className="bg-white rounded-lg border-l-4 border-yellow-400 shadow-sm p-4 relative min-h-[100px] overflow-hidden">
              {deletingNoteId === note.id && (
                  <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center">
                      <p>Delete this note?</p>
                      <div className="flex gap-3">
                          <button onClick={cancelDelete} className="text-gray-600">Cancel</button>
                          <button onClick={confirmDelete} className="text-red-500">Delete</button>
                      </div>
                  </div>
              )}
              <div className="pr-10 mb-2">
                 <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded mb-1">{note.targetDateDisplay}</span>
                 <h4 className="font-bold text-gray-800">{note.batch}</h4>
                 <p className="text-xs text-gray-500">{note.day} • {note.timeSlot}</p>
              </div>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleShareNote(note); }} className="absolute top-2 right-12 p-2">📢</button>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); requestDelete(note.id); }} className="absolute top-2 right-2 p-2">🗑️</button>
              <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">{note.text}</div>
              {note.link && <a href={ensureProtocol(note.link)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-xs block mt-2">View Link</a>}
           </div>
        ))}
      </div>
    );
  };

  if (isLoadingNotes) return <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-12 relative">
      <header className="bg-white shadow-sm sticky top-0 z-40 transition-colors">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-800">{teacher.name}</h1>
            <p className="text-xs text-gray-500">{teacher.department}</p>
          </div>
          <div className="flex items-center gap-2">
             <a href="mailto:abcddcba121202@gmail.com?subject=Discrepancy%20Report" className="text-xs font-bold bg-orange-50 text-orange-700 px-3 py-2 rounded-lg">Report</a>
             <button onClick={() => handleOpenRoomFinder()} className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg">Find Room</button>
             {isSaving && <span className="text-xs text-indigo-500">Syncing...</span>}
             <button onClick={onLogout} className="text-sm text-red-500 font-medium ml-1">Logout</button>
          </div>
        </div>
      </header>

      {/* --- NEW: STATIC HEADER FOR LEAVES --- */}
      {absentTeachers.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 mt-4">
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
               <div className="shrink-0 flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider bg-red-200 px-2 py-1 rounded">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   Faculty On Leave Today
               </div>
               <div className="flex-1 flex flex-wrap gap-2">
                   {absentTeachers.map(id => (
                       <span key={id} className="text-xs font-medium text-red-900 bg-white border border-red-100 px-2 py-1 rounded shadow-sm">
                           {allTeachers[id]?.name || id} ({id})
                       </span>
                   ))}
               </div>
            </div>
        </div>
      )}

      {/* IMPORTANT ALERTS */}
      {notesForToday.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 mt-4">
            {notesForToday.map(note => (
                <div key={note.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm mb-2">
                    <p className="text-gray-900 font-medium text-sm">{note.text}</p>
                </div>
            ))}
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">{getFormattedDate()}</p>
            <h2 className="text-3xl font-bold text-gray-900">{todayName}</h2>
          </div>
          <div className="text-right">
             <p className="text-2xl font-mono font-medium text-indigo-600">{currentTime}</p>
          </div>
        </div>

        <div className="flex bg-gray-200 p-1 rounded-lg">
            <button onClick={() => setView('LIVE')} className={`flex-1 py-2 text-sm ${view === 'LIVE' ? 'bg-white shadow-sm' : ''}`}>Live</button>
            <button onClick={() => setView('FULL_WEEK')} className={`flex-1 py-2 text-sm ${view === 'FULL_WEEK' ? 'bg-white shadow-sm' : ''}`}>Week</button>
            <button onClick={() => setView('NOTES')} className={`flex-1 py-2 text-sm ${view === 'NOTES' ? 'bg-white shadow-sm' : ''}`}>Notes</button>
            <button onClick={() => setView('UTILITIES')} className={`flex-1 py-2 text-sm ${view === 'UTILITIES' ? 'bg-white shadow-sm' : ''}`}>Utils</button>
        </div>

        {view === 'LIVE' && (
            <>
                <section>
                {activeClass ? <ClassCard session={activeClass} status="active" isHero={true} onEditNote={handleEditNote} onFindRoom={handleOpenRoomFinder} hasNote={false} /> :
                 nextClass ? <ClassCard session={nextClass} status="upcoming" isHero={true} onEditNote={handleEditNote} onFindRoom={handleOpenRoomFinder} hasNote={false} /> :
                 <div className="rounded-xl shadow-lg p-8 bg-gray-800 text-white text-center"><p>No more classes today.</p></div>}
                </section>
                <section><h3 className="text-gray-500 font-semibold mb-4 text-sm uppercase">Schedule</h3>{renderTimeline()}</section>
            </>
        )}
        {view === 'FULL_WEEK' && renderFullWeek()}
        {view === 'NOTES' && <section><h3 className="text-gray-500 font-semibold mb-4 text-sm uppercase">My Notes</h3>{renderNotesView()}</section>}
        {view === 'UTILITIES' && <section><Utilities teacher={teacher} /></section>}
      </main>

      <RoomFinderModal 
        isOpen={isRoomFinderOpen}
        onClose={() => setIsRoomFinderOpen(false)}
        initialDay={finderInitialDay}
        initialTimeIndex={finderInitialTime}
        absentTeacherIds={absentTeachers}
        allTeachers={allTeachers}
      />

      {editingSession && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-4 border-b flex justify-between"><h3>Edit Note</h3><button onClick={() => setEditingSession(null)}>✕</button></div>
                <div className="p-6 space-y-4">
                    <select value={selectedDate} onChange={handleDateChange} className="w-full border p-2 rounded">
                        {upcomingDates.map(date => <option key={toISODate(date)} value={toISODate(date)}>{toReadableDate(date)}</option>)}
                    </select>
                    <textarea value={noteText} onChange={e => setNoteText(e.target.value)} className="w-full border p-2 rounded h-24" placeholder="Note text..." />
                    <input type="url" value={noteLink} onChange={e => setNoteLink(e.target.value)} className="w-full border p-2 rounded" placeholder="Link (optional)..." />
                    <button onClick={handleSaveNote} className="w-full bg-indigo-600 text-white py-2 rounded">Save</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};