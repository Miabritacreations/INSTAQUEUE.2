import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { appointmentService } from '../services/api';
import { Appointment } from '../types';
import '../styles/Dashboard.css';

export const AdminDashboard: React.FC = () => {
  const [queues, setQueues] = useState<{ [key: number]: Appointment[] }>({});
  const [departments] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const socket = io(window.location.origin);

    const fetchQueues = async () => {
      try {
        const allQueues: { [key: number]: Appointment[] } = {};
        for (const deptId of departments) {
          const response = await appointmentService.getTodayQueue(deptId);
          allQueues[deptId] = response.data.queue;
        }
        setQueues(allQueues);
      } catch (error) {
        console.error('Failed to fetch queues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueues();

    // Listen for real-time queue updates
    socket.on('queue-updated', (data) => {
      setQueues((prev) => ({
        ...prev,
        [data.department_id]: data.queue,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [departments]);

  const handleServeNext = async (departmentId: number) => {
    try {
      await appointmentService.updateStatus(0, 'in_service');
      // Refresh queues
      const response = await appointmentService.getTodayQueue(departmentId);
      setQueues((prev) => ({
        ...prev,
        [departmentId]: response.data.queue,
      }));
    } catch (error) {
      console.error('Failed to serve next:', error);
    }
  };

  if (loading) return <div className="dashboard-container">Loading...</div>;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="dashboard-navbar">
        <div className="dashboard-nav-container">
          <h1 onClick={() => navigate('/')}>InstaQueue</h1>
          <div className="dashboard-nav-links">
            <span>Admin Dashboard</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>
      <div className="dashboard-container">
        <h1>Admin Dashboard - Today's Queues</h1>
        <div className="queues-grid">
          {departments.map((deptId) => (
            <div key={deptId} className="queue-section">
              <h2>Department {deptId}</h2>
              {queues[deptId]?.length === 0 ? (
                <p>No appointments</p>
              ) : (
                <>
                  <ul className="queue-list">
                    {queues[deptId]?.slice(0, 3).map((apt) => (
                      <li key={apt.id} className={`queue-item status-${apt.status}`}>
                        <strong>#{apt.queue_number}</strong> - {apt.student_name} ({apt.status})
                      </li>
                    ))}
                  </ul>
                  <button className="btn-primary" onClick={() => handleServeNext(deptId)}>
                    Serve Next
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
