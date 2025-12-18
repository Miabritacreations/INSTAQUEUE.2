import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { authService } from '../services/api';
import { MdPerson, MdEmail, MdPhone, MdSchool, MdEdit } from 'react-icons/md';
import toast from 'react-hot-toast';
import '../styles/Profile.css';

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    student_id: '',
    department: '',
    year: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile();
      const user = response.data.user;
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        student_id: user.student_id || '',
        department: user.department || '',
        year: user.year || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSaving(true);
    const loadingToast = toast.loading('Updating profile...');
    
    try {
      await authService.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        year: formData.year
      });
      toast.success('Profile updated successfully!', { id: loadingToast });
      setIsEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile', { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

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
            {formData.student_id && <p className="profile-id">{formData.student_id}</p>}
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
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
