import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: { name: string; email: string; phone?: string; department?: string; year?: string }) =>
    api.put('/auth/profile', data),
};

export const appointmentService = {
  createAppointment: (department_id: number, date: string, time: string, reason: string) =>
    api.post('/appointments', { department_id, date, time, reason }),
  getUserAppointments: () => api.get('/appointments/mine'),
  getStats: () => api.get('/appointments/stats'),
  getTodayQueue: (department_id: number) =>
    api.get(`/appointments/queue?department_id=${department_id}`),
  getNextAppointment: (department_id: number) =>
    api.get(`/appointments/next?department_id=${department_id}`),
  updateStatus: (id: number, status: string) =>
    api.put('/appointments/status', { id, status }),
  cancelAppointment: (id: number) => api.put('/appointments/cancel', { id }),
};

export const departmentService = {
  getDepartments: () => api.get('/departments'),
  getDepartment: (id: number) => api.get(`/departments/${id}`),
};

export const feedbackService = {
  submitFeedback: (department_id: number, rating: number, experience: string, suggestions?: string) =>
    api.post('/feedback', { department_id, rating, experience, suggestions }),
  getMyFeedback: () => api.get('/feedback/mine'),
  getAllFeedback: () => api.get('/feedback/all'),
  getDepartmentStats: (department_id: number) => api.get(`/feedback/stats/${department_id}`),
};

export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id: number) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (id: number) => api.delete(`/notifications/${id}`),
};

export default api;
