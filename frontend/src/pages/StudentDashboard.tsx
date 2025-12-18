import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../services/api';
import { Appointment } from '../types';
import { DashboardLayout } from '../components/DashboardLayout';
import { 
  MdCalendarToday, 
  MdCheckCircle, 
  MdPending, 
  MdEventAvailable,
  MdSchedule,
  MdArrowForward 
} from 'react-icons/md';
import '../styles/Dashboard.css';

interface Stats {
  total: number;
  pending: number;
  completed: number;
  confirmed: number;
  upcoming: number;
  recentAppointments: Appointment[];
  nextAppointment: Appointment | null;
}

export const StudentDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await appointmentService.getStats();
        setStats(response.data.stats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="error-container">
          <p>Failed to load dashboard data</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">Welcome back! Here's your appointment summary</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/book-appointment')}>
            <MdCalendarToday />
            Book New Appointment
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon">
              <MdCalendarToday />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.total}</h3>
              <p className="stat-label">Total Appointments</p>
            </div>
          </div>

          <div className="stat-card stat-pending">
            <div className="stat-icon">
              <MdPending />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.pending}</h3>
              <p className="stat-label">Pending</p>
            </div>
          </div>

          <div className="stat-card stat-confirmed">
            <div className="stat-icon">
              <MdEventAvailable />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.confirmed}</h3>
              <p className="stat-label">Confirmed</p>
            </div>
          </div>

          <div className="stat-card stat-completed">
            <div className="stat-icon">
              <MdCheckCircle />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.completed}</h3>
              <p className="stat-label">Completed</p>
            </div>
          </div>
        </div>

        {/* Next Appointment & Quick Actions */}
        <div className="dashboard-row">
          {stats.nextAppointment ? (
            <div className="next-appointment-card">
              <div className="card-header">
                <h2 className="card-title">
                  <MdSchedule />
                  Next Appointment
                </h2>
              </div>
              <div className="card-body">
                <h3 className="department-name">{stats.nextAppointment.department}</h3>
                <div className="appointment-details">
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {new Date(stats.nextAppointment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{stats.nextAppointment.time}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Queue Number:</span>
                    <span className="queue-badge">{stats.nextAppointment.queue_number}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge status-${stats.nextAppointment.status}`}>
                      {stats.nextAppointment.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="next-appointment-card empty">
              <div className="empty-state">
                <MdSchedule className="empty-icon" />
                <h3>No Upcoming Appointments</h3>
                <p>Book an appointment to get started</p>
                <button className="btn-primary" onClick={() => navigate('/book-appointment')}>
                  Book Now
                </button>
              </div>
            </div>
          )}

          <div className="quick-actions-card">
            <h2 className="card-title">Quick Actions</h2>
            <div className="actions-list">
              <button className="action-btn" onClick={() => navigate('/book-appointment')}>
                <MdCalendarToday />
                <span>Book Appointment</span>
                <MdArrowForward className="arrow" />
              </button>
              <button className="action-btn" onClick={() => navigate('/appointments')}>
                <MdEventAvailable />
                <span>View All Appointments</span>
                <MdArrowForward className="arrow" />
              </button>
              <button className="action-btn" onClick={() => navigate('/feedback')}>
                <MdCheckCircle />
                <span>Submit Feedback</span>
                <MdArrowForward className="arrow" />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="recent-appointments-section">
          <div className="section-header">
            <h2 className="section-title">Recent Activity</h2>
            <button className="view-all-btn" onClick={() => navigate('/appointments')}>
              View All
              <MdArrowForward />
            </button>
          </div>
          {stats.recentAppointments.length === 0 ? (
            <div className="empty-state">
              <p>No recent appointments</p>
            </div>
          ) : (
            <div className="recent-appointments-grid">
              {stats.recentAppointments.map((apt) => (
                <div key={apt.id} className="recent-appointment-card">
                  <div className="card-header">
                    <h3 className="department-name">{apt.department}</h3>
                    <span className={`status-badge status-${apt.status}`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="card-body">
                    <p className="appointment-date">
                      {new Date(apt.date).toLocaleDateString()} at {apt.time}
                    </p>
                    <p className="queue-info">Queue: {apt.queue_number}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
