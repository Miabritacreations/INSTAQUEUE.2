import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { departmentService, appointmentService } from '../services/api';
import { MdCalendarToday, MdAccessTime, MdPerson } from 'react-icons/md';
import toast from 'react-hot-toast';
import '../styles/BookAppointment.css';

interface Department {
  id: number;
  name: string;
  description: string;
}

export function BookAppointment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    department_id: '',
    date: '',
    time: '',
    reason: ''
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentService.getDepartments();
        setDepartments(response.data.departments);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        toast.error('Failed to load departments');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM',
    '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.department_id || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    const loadingToast = toast.loading('Booking appointment...');
    
    try {
      await appointmentService.createAppointment(
        parseInt(formData.department_id),
        formData.date,
        formData.time,
        formData.reason
      );
      toast.success('Appointment booked successfully!', { id: loadingToast });
      setFormData({ department_id: '', date: '', time: '', reason: '' });
      
      // Navigate to appointments page after 1 second
      setTimeout(() => navigate('/appointments'), 1000);
    } catch (error: any) {
      console.error('Failed to book appointment:', error);
      toast.error(error.response?.data?.error || 'Failed to book appointment', { id: loadingToast });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <DashboardLayout>
      <div className="book-appointment-page">
        <div className="page-header">
          <h1 className="page-title">Book an Appointment</h1>
          <p className="page-subtitle">Schedule your visit to a department</p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="appointment-form">
            <div className="form-group">
              <label htmlFor="department" className="form-label">
                <MdPerson className="label-icon" />
                Department *
              </label>
              <select
                id="department_id"
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                className="form-select"
                required
                disabled={loading}
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  <MdCalendarToday className="label-icon" />
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time" className="form-label">
                  <MdAccessTime className="label-icon" />
                  Time *
                </label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reason" className="form-label">
                Reason (Optional)
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="form-textarea"
                rows={4}
                placeholder="Briefly describe the reason for your appointment..."
              />
            </div>

            <button type="submit" className="submit-btn">
              Book Appointment
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
