import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LandingPage } from '../pages/LandingPage';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { StudentDashboard } from '../pages/StudentDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';

export function AppRouter() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<StudentDashboard />} />} />
          <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
