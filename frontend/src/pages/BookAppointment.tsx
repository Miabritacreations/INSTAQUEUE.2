import { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { MdCalendarToday, MdAccessTime, MdPerson } from 'react-icons/md';
import toast from 'react-hot-toast';
import '../styles/BookAppointment.css';

export function BookAppointment() {
  const [formData, setFormData] = useState({
    department: '',
    date: '',
    time: '',
    reason: ''
  });

  const departments = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History'
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM',
    '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.department || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Mock API call
    toast.success('Appointment booked successfully!');
    setFormData({ department: '', date: '', time: '', reason: '' });
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
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
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
