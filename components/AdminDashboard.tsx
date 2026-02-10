import React, { useState, useEffect } from 'react';
import { TeacherProfile } from '../types';

interface AdminDashboardProps {
  allTeachers: any; 
  onLogout: () => void;
  adminToken: string; // New prop for security
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ allTeachers, onLogout, adminToken }) => {
  const [absentIds, setAbsentIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch current absences
  useEffect(() => {
    const fetchAbsences = async () => {
      try {
        const res = await fetch('/api/absences');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.absentIds)) {
            setAbsentIds(data.absentIds);
          }
        }
      } catch (e) {
        console.error("Failed to fetch absences", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAbsences();
  }, []);

  const toggleAbsence = async (teacherId: string, currentStatus: boolean) => {
    // 1. Optimistic UI Update
    if (currentStatus) {
        setAbsentIds(prev => prev.filter(id => id !== teacherId));
    } else {
        setAbsentIds(prev => [...prev, teacherId]);
    }

    // 2. Secure Send to Server
    try {
        const response = await fetch('/api/absences', {
            method: 'POST',
            // CRITICAL: We send the token in the header
            headers: { 
                'Content-Type': 'application/json',
                'X-Admin-Token': adminToken 
            },
            body: JSON.stringify({ 
                teacherId, 
                action: currentStatus ? 'REMOVE' : 'MARK' 
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "Server failed to save");
        }

    } catch (e: any) {
        alert(`Failed to save: ${e.message}`);
        // Revert UI on failure
        if (currentStatus) setAbsentIds(prev => [...prev, teacherId]);
        else setAbsentIds(prev => prev.filter(id => id !== teacherId));
    }
  };

  const teachersList = Object.values(allTeachers || {}) as TeacherProfile[];
  
  const sortedTeachers = teachersList.sort((a, b) => 
    (a.name || '').localeCompare(b.name || '')
  );

  const filteredTeachers = sortedTeachers.filter(t => 
    (t.name && t.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (t.id && t.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Admin Console</h1>
            <p className="text-xs text-gray-400">Attendance Management</p>
          </div>
          <button onClick={onLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-bold transition-colors">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Manage Daily Attendance</h2>
            <p className="text-sm text-gray-500 mb-6">
                Mark teachers as absent for today. 
                This frees up their rooms in the Room Finder. 
                <span className="text-orange-600 font-semibold"> Resets automatically at midnight IST.</span>
            </p>

            <input 
                type="text" 
                placeholder="Search faculty name or code..." 
                className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />

            {loading ? (
                <div className="text-center py-8 text-gray-500">Loading data...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredTeachers.map(teacher => {
                        const isAbsent = absentIds.includes(teacher.id);
                        return (
                            <div 
                                key={teacher.id} 
                                onClick={() => toggleAbsence(teacher.id, isAbsent)}
                                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all select-none ${isAbsent ? 'bg-red-50 border-red-300' : 'bg-white border-gray-100 hover:border-indigo-300'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isAbsent ? 'bg-red-200 text-red-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                        {teacher.id}
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${isAbsent ? 'text-red-900' : 'text-gray-800'}`}>{teacher.name}</h3>
                                        <p className="text-xs text-gray-500">{teacher.department}</p>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded border flex items-center justify-center ${isAbsent ? 'bg-red-500 border-red-500' : 'border-gray-300 bg-white'}`}>
                                    {isAbsent && (
                                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
      </main>
    </div>
  );
};