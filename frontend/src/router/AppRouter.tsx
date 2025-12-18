import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LandingPage } from '../pages/LandingPage';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { StudentDashboard } from '../pages/StudentDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';
import { Appointments } from '../pages/Appointments';
import { BookAppointment } from '../pages/BookAppointment';
import { Notifications } from '../pages/Notifications';
import { Profile } from '../pages/Profile';
import { Feedback } from '../pages/Feedback';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';

export function AppRouter() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<StudentDashboard />} />} />
          <Route path="/appointments" element={<ProtectedRoute element={<Appointments />} />} />
          <Route path="/book-appointment" element={<ProtectedRoute element={<BookAppointment />} />} />
          <Route path="/notifications" element={<ProtectedRoute element={<Notifications />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/feedback" element={<ProtectedRoute element={<Feedback />} />} />
          <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
