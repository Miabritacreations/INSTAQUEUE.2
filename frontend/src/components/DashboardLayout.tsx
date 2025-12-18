import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/api';
import toast from 'react-hot-toast';
import { 
  MdDashboard, 
  MdCalendarToday, 
  MdFeedback, 
  MdNotifications,
  MdMenu,
  MdClose,
  MdLogout,
  MdPerson
} from 'react-icons/md';
import '../styles/DashboardLayout.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchNotificationCount();
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setNotificationCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
      console.error('Logout error:', error);
    }
  };

  const navigationItems = [
    { path: '/dashboard', icon: MdDashboard, label: 'Dashboard' },
    { path: '/appointments', icon: MdCalendarToday, label: 'My Appointments' },
    { path: '/book-appointment', icon: MdCalendarToday, label: 'Book Appointment' },
    { path: '/feedback', icon: MdFeedback, label: 'Feedback' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <MdClose /> : <MdMenu />}
            </button>
            <h1 className="navbar-logo" onClick={() => navigate('/')}>
              InstaQueue
            </h1>
          </div>
          <div className="navbar-right">
            <button 
              className="navbar-icon-btn"
              onClick={() => navigate('/notifications')}
              title="Notifications"
            >
              <MdNotifications />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>
            <button 
              className="navbar-icon-btn"
              onClick={() => navigate('/profile')}
              title="Profile"
            >
              <MdPerson />
            </button>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Student'}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-content">
            <nav className="sidebar-nav">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => navigate(item.path)}
                  >
                    <Icon className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                  </button>
                );
              })}
              
              <div className="sidebar-divider"></div>
              
              <button
                className="nav-item logout-item"
                onClick={handleLogout}
              >
                <MdLogout className="nav-icon" />
                <span className="nav-label">Logout</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
};
