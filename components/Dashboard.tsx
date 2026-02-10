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
  const [expandLeaves, setExpandLeaves] = useState(false);

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
  
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  // Room Finder
  const [isRoomFinderOpen, setIsRoomFinderOpen] = useState(false);
  const [finderInitialDay, setFinderInitialDay] = useState<string | undefined>(undefined);
  const [finderInitialTime, setFinderInitialTime] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetch('/api/absences')
      .then(r => r.json())
      .then(d => {
         if(d.success) setAbsentTeachers(d.absentIds);
      });
  }, []);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getFormattedTime());
      setCurrentMinutes(getCurrentMinutes());
      setTodayName(getCurrentDayName());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
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

  const todaysIsoDate = toISODate(new Date());
  const todaysClasses = teacher.schedule[todayName] || [];
  let activeClass: ClassSession | null = null;
  let nextClass: ClassSession | null = null;
  const sortedClasses = [...todaysClasses].sort((a, b) => a.rawTimeStart - b.rawTimeStart);

  for (const session of sortedClasses) {
    const status = getClassStatus(session, currentMinutes);
    if (status === 'active') activeClass = session;
    else if (status === 'upcoming' && !nextClass) nextClass = session;
  }

  const renderTimeline = () => {
    if (todaysClasses.length === 0) {
      return (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100 mt-4">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
             <span className="text-2xl">☕</span>
          </div>
          <p className="text-slate-500 font-medium">No classes scheduled for today.</p>
          <p className="text-slate-400 text-sm mt-1">Enjoy your free time!</p>
        </div>
      );
    }
    return (
      <div className="space-y-4 mt-2">
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
        <div className="space-y-6 mt-4">
            {days.map(day => (
                <div key={day} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 text-lg flex items-center gap-2">
                        <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                        {day}
                    </h3>
                    {teacher.schedule[day] && teacher.schedule[day].length > 0 ? (
                        <div className="space-y-3">
                            {teacher.schedule[day].map(cls => (
                                <div key={cls.id} className="flex justify-between items-start group p-3 hover:bg-slate-50 rounded-xl transition-colors">
                                    <div className="flex gap-4">
                                        <div className="w-16 font-mono text-sm font-semibold text-slate-500 pt-1">{cls.startTime}</div>
                                        <div>
                                            <div className="font-bold text-slate-800">{cls.subject}</div>
                                            <div className="text-xs text-slate-500 font-medium mt-0.5">{cls.batch}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                      <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-xs">{cls.room}</span>
                                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button onClick={() => handleEditNote(cls)} className="p-1.5 hover:bg-white rounded-md text-slate-400 hover:text-indigo-600 shadow-sm border border-transparent hover:border-slate-200">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                          </button>
                                          <button onClick={() => handleOpenRoomFinder(cls)} className="p-1.5 hover:bg-white rounded-md text-slate-400 hover:text-indigo-600 shadow-sm border border-transparent hover:border-slate-200">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                          </button>
                                      </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-slate-400 italic text-sm pl-4">No classes scheduled.</p>}
                </div>
            ))}
        </div>
    )
  }

  const renderNotesView = () => {
    const sortedNotes = [...notes].sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
    if (sortedNotes.length === 0) return (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100 mt-4">
            <p className="text-slate-400">You haven't added any notes yet.</p>
        </div>
    );
    return (
      <div className="space-y-4 mt-4">
        {sortedNotes.map(note => (
           <div key={note.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
              {deletingNoteId === note.id && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-fadeIn">
                      <p className="font-bold text-slate-800 mb-3">Delete this note?</p>
                      <div className="flex gap-3">
                          <button onClick={cancelDelete} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
                          <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">Delete</button>
                      </div>
                  </div>
              )}
              <div className="flex justify-between items-start mb-3 pl-2">
                 <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-yellow-100">{note.targetDateDisplay}</span>
                        <span className="text-xs text-slate-400 font-medium">{note.day} • {note.timeSlot}</span>
                     </div>
                     <h4 className="font-bold text-slate-800 text-lg">{note.batch}</h4>
                 </div>
                 <div className="flex gap-1">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleShareNote(note); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Share via WhatsApp">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    </button>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); requestDelete(note.id); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Note">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                 </div>
              </div>
              
              <div className="ml-2 mt-2 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap font-medium">{note.text}</div>
              {note.link && (
                  <a href={ensureProtocol(note.link)} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1 mt-3 text-indigo-600 text-xs font-bold hover:underline">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      View Attached Resource
                  </a>
              )}
           </div>
        ))}
      </div>
    );
  };

  if (isLoadingNotes) return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium animate-pulse">Syncing your workspace...</p>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative font-sans text-slate-800">
      
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg text-white font-bold text-lg">
                {teacher.name.charAt(0)}
            </div>
            <div>
                <h1 className="text-sm font-bold text-slate-900 leading-tight">{teacher.name}</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{teacher.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => handleOpenRoomFinder()} className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                Find Room
             </button>
             {isSaving && <span className="text-xs font-bold text-indigo-500 animate-pulse">Saving...</span>}
             <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
             </button>
          </div>
        </div>
      </nav>

      {/* Alerts */}
      {absentTeachers.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 mt-4">
            <div className="bg-red-50 border border-red-100 rounded-xl overflow-hidden shadow-sm">
               <button 
                 onClick={() => setExpandLeaves(!expandLeaves)}
                 className="w-full flex justify-between items-center p-3 text-red-800 text-xs font-bold uppercase tracking-wider hover:bg-red-100/50 transition-colors"
               >
                  <span className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                     Faculty on Leave ({absentTeachers.length})
                  </span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${expandLeaves ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
               </button>
               
               {expandLeaves && (
                   <div className="p-3 bg-white/50 border-t border-red-100/50">
                       <div className="flex flex-wrap gap-2">
                           {absentTeachers.map(id => (
                               <span key={id} className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">
                                   {allTeachers[id]?.name || id}
                               </span>
                           ))}
                       </div>
                   </div>
               )}
            </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Date Header */}
        <div className="flex justify-between items-end pb-2">
          <div>
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">{getFormattedDate()}</p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{todayName}</h2>
          </div>
          <div className="text-right bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
             <p className="text-xl font-mono font-bold text-indigo-600 tracking-tight">{currentTime}</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 flex gap-1">
            {['LIVE', 'FULL_WEEK', 'NOTES', 'UTILITIES'].map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setView(tab as ViewState)} 
                    className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all duration-200 ${
                        view === tab 
                        ? 'bg-slate-800 text-white shadow-md transform scale-[1.02]' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                >
                    {tab.replace('_', ' ')}
                </button>
            ))}
        </div>

        {/* Views */}
        <div className="animate-fadeIn">
            {view === 'LIVE' && (
                <>
                    <section>
                    {activeClass ? <ClassCard session={activeClass} status="active" isHero={true} onEditNote={handleEditNote} onFindRoom={handleOpenRoomFinder} hasNote={false} /> :
                    nextClass ? <ClassCard session={nextClass} status="upcoming" isHero={true} onEditNote={handleEditNote} onFindRoom={handleOpenRoomFinder} hasNote={false} /> :
                    <div className="rounded-2xl shadow-xl p-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>
                        <h3 className="text-xl font-bold mb-2 relative z-10">All Done!</h3>
                        <p className="text-slate-400 relative z-10">No more classes scheduled for today.</p>
                    </div>}
                    </section>
                    <section className="mt-8">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pl-1">Your Schedule</h3>
                        {renderTimeline()}
                    </section>
                </>
            )}
            {view === 'FULL_WEEK' && renderFullWeek()}
            {view === 'NOTES' && (
                <section>
                    <div className="flex justify-between items-end mb-4 px-1">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">My Notes</h3>
                    </div>
                    {renderNotesView()}
                </section>
            )}
            {view === 'UTILITIES' && <section><Utilities teacher={teacher} /></section>}
        </div>
      </main>

      <RoomFinderModal 
        isOpen={isRoomFinderOpen}
        onClose={() => setIsRoomFinderOpen(false)}
        initialDay={finderInitialDay}
        initialTimeIndex={finderInitialTime}
        absentTeacherIds={absentTeachers}
        allTeachers={allTeachers}
      />

      {/* Edit Note Modal */}
      {editingSession && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Class Note</h3>
                        <p className="text-xs text-slate-500 font-medium">{editingSession.subject} • {editingSession.batch}</p>
                    </div>
                    <button onClick={() => setEditingSession(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">For Date</label>
                        <select value={selectedDate} onChange={handleDateChange} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow">
                            {upcomingDates.map(date => <option key={toISODate(date)} value={toISODate(date)}>{toReadableDate(date)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Note Content</label>
                        <textarea 
                            value={noteText} 
                            onChange={e => setNoteText(e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow h-32 resize-none leading-relaxed" 
                            placeholder="Type your instructions, homework, or reminders here..." 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Resource Link (Optional)</label>
                        <input 
                            type="url" 
                            value={noteLink} 
                            onChange={e => setNoteLink(e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" 
                            placeholder="e.g., https://drive.google.com/..." 
                        />
                    </div>
                    <button onClick={handleSaveNote} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-indigo-200 transition-all transform hover:-translate-y-0.5">
                        Save Note
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};