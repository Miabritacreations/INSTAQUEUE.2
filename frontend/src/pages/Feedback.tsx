import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { departmentService, feedbackService } from '../services/api';
import { MdStar, MdStarBorder } from 'react-icons/md';
import toast from 'react-hot-toast';
import '../styles/Feedback.css';

interface Department {
  id: number;
  name: string;
  description: string;
}

export function Feedback() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    department_id: '',
    experience: '',
    suggestions: ''
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.department_id || !formData.experience || rating === 0) {
      toast.error('Please fill in all required fields and provide a rating');
      return;
    }

    setSubmitting(true);
    const loadingToast = toast.loading('Submitting feedback...');
    
    try {
      await feedbackService.submitFeedback(
        parseInt(formData.department_id),
        rating,
        formData.experience,
        formData.suggestions
      );
      toast.success('Thank you for your feedback!', { id: loadingToast });
      setFormData({ department_id: '', experience: '', suggestions: '' });
      setRating(0);
    } catch (error: any) {
      console.error('Failed to submit feedback:', error);
      toast.error(error.response?.data?.error || 'Failed to submit feedback', { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
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

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
