import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/api';
import { Appointment } from '../types';
import './Dashboard.css';

export const StudentDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentService.getUserAppointments();
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (id: number) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.cancelAppointment(id);
        setAppointments((prev) => prev.filter((a) => a.id !== id));
      } catch (error) {
        console.error('Failed to cancel appointment:', error);
      }
    }
  };

  if (loading) return <div className="dashboard-container">Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1>My Appointments</h1>
      {appointments.length === 0 ? (
        <p>No appointments yet</p>
      ) : (
        <div className="appointments-grid">
          {appointments.map((apt) => (
            <div key={apt.id} className={`appointment-card status-${apt.status}`}>
              <h3>{apt.department}</h3>
              <p><strong>Queue #:</strong> {apt.queue_number}</p>
              <p><strong>Date:</strong> {apt.date}</p>
              <p><strong>Time:</strong> {apt.time}</p>
              <p><strong>Status:</strong> {apt.status}</p>
              {apt.reason && <p><strong>Reason:</strong> {apt.reason}</p>}
              {apt.status === 'pending' && (
                <button onClick={() => handleCancel(apt.id)} className="btn-danger">
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
