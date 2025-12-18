import { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { MdStar, MdStarBorder } from 'react-icons/md';
import toast from 'react-hot-toast';
import '../styles/Feedback.css';

export function Feedback() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    department: '',
    experience: '',
    suggestions: ''
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.department || !formData.experience || rating === 0) {
      toast.error('Please fill in all required fields and provide a rating');
      return;
    }

    // Mock API call
    toast.success('Thank you for your feedback!');
    setFormData({ department: '', experience: '', suggestions: '' });
    setRating(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <DashboardLayout>
      <div className="feedback-page">
        <div className="page-header">
          <h1 className="page-title">Submit Feedback</h1>
          <p className="page-subtitle">Help us improve our services</p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label htmlFor="department" className="form-label">
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

            <div className="form-group">
              <label className="form-label">Rating *</label>
              <div className="rating-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="star-btn"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    {star <= (hoveredRating || rating) ? (
                      <MdStar className="star filled" />
                    ) : (
                      <MdStarBorder className="star" />
                    )}
                  </button>
                ))}
                <span className="rating-text">
                  {rating > 0 && `${rating} out of 5 stars`}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="experience" className="form-label">
                Your Experience *
              </label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="form-textarea"
                rows={5}
                placeholder="Tell us about your experience with the department..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="suggestions" className="form-label">
                Suggestions for Improvement (Optional)
              </label>
              <textarea
                id="suggestions"
                name="suggestions"
                value={formData.suggestions}
                onChange={handleChange}
                className="form-textarea"
                rows={4}
                placeholder="Share any suggestions you have..."
              />
            </div>

            <button type="submit" className="submit-btn">
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
