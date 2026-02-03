import React, { useState, useEffect } from 'react';
import { TIMETABLE, TEACHER_NAME } from '../constants';
import { ClassSession } from '../types';
import { getCurrentDayName, getCurrentMinutes, getFormattedDate, getFormattedTime, getClassStatus } from '../utils/timeUtils';
import { ClassCard } from './ClassCard';

export const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [currentTime, setCurrentTime] = useState<string>(getFormattedTime());
  const [currentMinutes, setCurrentMinutes] = useState<number>(getCurrentMinutes());
  const [todayName, setTodayName] = useState<string>(getCurrentDayName());
  
  // State for view toggle
  const [showFullWeek, setShowFullWeek] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getFormattedTime());
      setCurrentMinutes(getCurrentMinutes());
      setTodayName(getCurrentDayName());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const todaysClasses = TIMETABLE[todayName] || [];
  
  // Logic to find active and next classes
  let activeClass: ClassSession | null = null;
  let nextClass: ClassSession | null = null;
  
  // Sort classes by time just in case, though constant is sorted
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
           />
        ))}
      </div>
    );
  };

  const renderFullWeek = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return (
        <div className="space-y-6">
            {days.map(day => (
                <div key={day} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 border-b pb-2 mb-3 text-lg">{day}</h3>
                    {TIMETABLE[day].length > 0 ? (
                        <div className="space-y-2">
                            {TIMETABLE[day].map(cls => (
                                <div key={cls.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                                    <span className="font-medium text-gray-700 w-24">{cls.startTime}</span>
                                    <div className="flex-1 px-4">
                                        <div className="font-semibold text-gray-800">{cls.subject}</div>
                                        <div className="text-xs text-gray-500">{cls.batch}</div>
                                    </div>
                                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{cls.room}</span>
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

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-800">{TEACHER_NAME}</h1>
            <p className="text-xs text-gray-500">Shri Ram College of Commerce</p>
          </div>
          <button 
            onClick={onLogout}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

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
                onClick={() => setShowFullWeek(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!showFullWeek ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Live View
            </button>
            <button 
                onClick={() => setShowFullWeek(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${showFullWeek ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Full Week
            </button>
        </div>

        {!showFullWeek ? (
            <>
                {/* Hero Card: Active or Next Class */}
                <section>
                {activeClass ? (
                    <ClassCard session={activeClass} status="active" isHero={true} />
                ) : nextClass ? (
                    <ClassCard session={nextClass} status="upcoming" isHero={true} />
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
        ) : (
            renderFullWeek()
        )}
      </main>
    </div>
  );
};