import React from 'react';
import LoginPage from './LoginPage';
import PasswordResetPage from './PasswordResetPage';
import RegisterPage from './RegisterPage';
import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ReceptionDashboard from './pages/ReceptionDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/password' element={<PasswordResetPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route 
          path='/admin-dashboard' 
          element={
            <ProtectedRoute requiredRole="Administrateur">
              <AdminDashboard/>
            </ProtectedRoute>
          }
        />
        <Route 
          path='/reception-dashboard' 
          element={
            <ProtectedRoute requiredRole="Réceptionniste">
              <ReceptionDashboard/>
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
