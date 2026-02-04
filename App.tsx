import React, { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { AppState, TeacherProfile } from './types';

const App: React.FC = () => {
 const [appState, setAppState] = useState<AppState>(AppState.LOGIN);
 const [currentTeacher, setCurrentTeacher] = useState<TeacherProfile | null>(null);

 const handleLogin = (teacher: TeacherProfile) => {
   setCurrentTeacher(teacher);
   
   // --- DATABASE INTEGRATION START ---
   // Save the teacher ID (passcode) to storage so the DB knows who is logged in
   localStorage.setItem('teacherCode', teacher.id); 
   // --- DATABASE INTEGRATION END ---

   setAppState(AppState.DASHBOARD);
 };

 const handleLogout = () => {
   setCurrentTeacher(null);
   
   // --- DATABASE INTEGRATION START ---
   localStorage.removeItem('teacherCode');
   // --- DATABASE INTEGRATION END ---

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