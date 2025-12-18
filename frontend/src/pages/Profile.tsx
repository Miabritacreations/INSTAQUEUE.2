import { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { MdPerson, MdEmail, MdPhone, MdSchool, MdEdit } from 'react-icons/md';
import toast from 'react-hot-toast';
import '../styles/Profile.css';

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@student.edu',
    phone: '+254 712 345 678',
    studentId: 'ST2024001',
    department: 'Computer Science',
    year: '3rd Year'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock API call
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="profile-page">
        <div className="page-header">
          <h1 className="page-title">My Profile</h1>
          <button
            className="edit-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            <MdEdit />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-container">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <MdPerson />
            </div>
            <h2 className="profile-name">{formData.name}</h2>
            <p className="profile-id">{formData.studentId}</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label className="form-label">
                <MdPerson className="label-icon" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <MdEmail className="label-icon" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <MdPhone className="label-icon" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <MdSchool className="label-icon" />
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-input"
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <MdSchool className="label-icon" />
                Year of Study
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="form-select"
                disabled={!isEditing}
                required
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {isEditing && (
              <button type="submit" className="save-btn">
                Save Changes
              </button>
            )}
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
