import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { MdNotifications, MdCheckCircle, MdInfo } from 'react-icons/md';
import '../styles/Notifications.css';

interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    // Mock data - replace with API call
    setNotifications([
      {
        id: 1,
        type: 'success',
        title: 'Appointment Confirmed',
        message: 'Your appointment with Computer Science department has been confirmed for Dec 20, 2025 at 10:00 AM',
        time: '2 hours ago',
        read: false
      },
      {
        id: 2,
        type: 'info',
        title: 'Queue Update',
        message: 'You are now 5th in the queue for Mathematics department',
        time: '5 hours ago',
        read: false
      },
      {
        id: 3,
        type: 'success',
        title: 'Appointment Completed',
        message: 'Your appointment with Mathematics department has been marked as completed',
        time: '1 day ago',
        read: true
      }
    ]);
  }, []);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <MdCheckCircle className="notif-icon success" />;
      case 'info':
        return <MdInfo className="notif-icon info" />;
      default:
        return <MdNotifications className="notif-icon warning" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="notifications-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">Stay updated with your appointments</p>
          </div>
          <button onClick={markAllAsRead} className="mark-all-btn">
            Mark all as read
          </button>
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({notifications.filter(n => !n.read).length})
          </button>
        </div>

        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <MdNotifications className="empty-icon" />
              <p>No notifications to display</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                {getIcon(notification.type)}
                <div className="notif-content">
                  <h3 className="notif-title">{notification.title}</h3>
                  <p className="notif-message">{notification.message}</p>
                  <span className="notif-time">{notification.time}</span>
                </div>
                {!notification.read && <div className="unread-badge"></div>}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
