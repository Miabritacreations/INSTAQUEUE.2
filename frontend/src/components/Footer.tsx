import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="landing-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>InstaQueue</h4>
          <p>Smart campus queue management for modern universities.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/#features">Features</Link></li>
            <li><Link to="/#departments">Departments</Link></li>
            <li><Link to="/#how-it-works">How It Works</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>support@instaqueue.local</p>
          <p>+1 (555) 123-4567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 InstaQueue. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
