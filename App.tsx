import React, { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { TEACHERS } from './functions/teacherData'; 
import { TeacherProfile } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<TeacherProfile | null>(null);

  const handleLoginSuccess = (user: any) => {
    if (user.isAdmin) {
        setIsAdmin(true);
        setIsAuthenticated(true);
    } else {
        setCurrentUser(user);
        setIsAuthenticated(true);
        // Persist session
        localStorage.setItem('teacherCode', user.id);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentUser(null);
    localStorage.removeItem('teacherCode');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {!isAuthenticated ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : isAdmin ? (
        // cast TEACHERS to any to avoid TypeScript strict signature mismatch
        <AdminDashboard allTeachers={TEACHERS as any} onLogout={handleLogout} />
      ) : (
        <Dashboard 
          teacher={currentUser!} 
          onLogout={handleLogout} 
          allTeachers={TEACHERS as any} // Cast here as well for safety
        />
      )}
    </div>
  );
}

export default App;