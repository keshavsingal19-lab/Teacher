import React, { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { TEACHERS } from './functions/teacherData'; 
import { TeacherProfile } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState(''); // Store token in state
  const [currentUser, setCurrentUser] = useState<TeacherProfile | null>(null);

  const handleLoginSuccess = (data: any) => {
    if (data.isAdmin) {
        setIsAdmin(true);
        setIsAuthenticated(true);
        setAdminToken(data.token);
        
        // Persist admin session
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminToken', data.token);
    } else {
        setCurrentUser(data);
        setIsAuthenticated(true);
        localStorage.setItem('teacherCode', data.id);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentUser(null);
    setAdminToken('');
    
    // Clear all storage
    localStorage.removeItem('teacherCode');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminToken');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {!isAuthenticated ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : isAdmin ? (
        <AdminDashboard 
            allTeachers={TEACHERS as any} 
            onLogout={handleLogout} 
            adminToken={adminToken} // Pass token to dashboard
        />
      ) : (
        <Dashboard 
          teacher={currentUser!} 
          onLogout={handleLogout} 
          allTeachers={TEACHERS as any} 
        />
      )}
    </div>
  );
}

export default App;