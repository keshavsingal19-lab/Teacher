import React, { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { AppState, TeacherProfile } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);
  const [currentTeacher, setCurrentTeacher] = useState<TeacherProfile | null>(null);

  const handleLogin = (teacher: TeacherProfile) => {
    setCurrentTeacher(teacher);
    setAppState(AppState.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentTeacher(null);
    setAppState(AppState.LOGIN);
  };

  return (
    <>
      {appState === AppState.LOGIN && <Login onLogin={handleLogin} />}
      {appState === AppState.DASHBOARD && currentTeacher && (
        <Dashboard teacher={currentTeacher} onLogout={handleLogout} />
      )}
    </>
  );
};

export default App;