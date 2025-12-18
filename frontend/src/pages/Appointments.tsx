import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { appointmentService } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/Appointments.css';

interface Appointment {
  id: number;
  department: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  queue_number: string;
  reason?: string;
}

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentService.getUserAppointments();
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusClass = (status: string) => {
    return `status-badge status-${status}`;
  };

  return (
    <DashboardLayout>
      <div className="appointments-page">
        <div className="page-header">
          <h1 className="page-title">My Appointments</h1>
          <p className="page-subtitle">View and manage your scheduled appointments</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading appointments...</p>
          </div>
        ) : (
          <div className="appointments-grid">
            {appointments.length === 0 ? (
              <div className="empty-state">
                <p>No appointments found</p>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <div className="card-header">
                    <span className={getStatusClass(appointment.status)}>
                      {appointment.status.toUpperCase()}
                    </span>
                    <span className="queue-number">{appointment.queue_number}</span>
                  </div>
                  <div className="card-body">
                    <h3 className="department-name">{appointment.department}</h3>
                    <div className="appointment-details">
                      <div className="detail-item">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">
                          {new Date(appointment.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Time:</span>
                        <span className="detail-value">{appointment.time}</span>
                      </div>
                      {appointment.reason && (
                        <div className="detail-item">
                          <span className="detail-label">Reason:</span>
                          <span className="detail-value">{appointment.reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
