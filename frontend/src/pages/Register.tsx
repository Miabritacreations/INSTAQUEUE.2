import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(name, email, password);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <nav className="auth-navbar">
        <div className="auth-nav-container">
          <h1 onClick={() => navigate('/')}>InstaQueue</h1>
          <div className="auth-nav-links">
            <a href="/">Home</a>
            <a href="/login">Sign In</a>
          </div>
        </div>
      </nav>
      <div className="auth-content">
        <div className="auth-card">
          <h1>Create Account</h1>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p>
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};
