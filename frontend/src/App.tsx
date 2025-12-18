import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <nav className="navbar">
          <div className="nav-container">
            <h1>InstaQueue</h1>
            <div className="nav-links">
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<StudentDashboard />} />} />
          <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
