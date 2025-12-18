import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

export function LandingPage() {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

  window.addEventListener('scroll', () => {
    setScrollPosition(window.scrollY);
  });

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero" style={{ backgroundPosition: `center ${scrollPosition * 0.5}px` }}>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Smart Campus Queue Management</h1>
            <p className="hero-subtitle">Eliminate physical queues. Get real-time updates. Manage your time efficiently.</p>
            
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => navigate('/register')}>
                Get Started Free
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <h3>50+</h3>
                <p>Campus Departments</p>
              </div>
              <div className="stat">
                <h3>5K+</h3>
                <p>Active Students</p>
              </div>
              <div className="stat">
                <h3>99%</h3>
                <p>Satisfaction Rate</p>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="feature-box">
              <div className="feature-icon">📱</div>
              <p>Mobile-First Design</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">⚡</div>
              <p>Real-Time Updates</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">✓</div>
              <p>No More Waiting</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="problems-section">
        <h2>The Problem We Solve</h2>
        <div className="problems-grid">
          <div className="problem-card">
            <div className="problem-icon">👥</div>
            <h3>Long Physical Queues</h3>
            <p>Students waste hours standing in queues at departments just to book appointments.</p>
          </div>
          <div className="problem-card">
            <div className="problem-icon">⏰</div>
            <h3>Unpredictable Wait Times</h3>
            <p>No visibility into queue status means uncertainty and frustration.</p>
          </div>
          <div className="problem-card">
            <div className="problem-icon">❌</div>
            <h3>Inefficient Resource Use</h3>
            <p>Department staff can't manage workflow or predict staffing needs.</p>
          </div>
          <div className="problem-card">
            <div className="problem-icon">📊</div>
            <h3>Poor Data Insights</h3>
            <p>No analytics on queue patterns, peak times, or service efficiency.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-num">01</div>
            <h3>Smart Booking System</h3>
            <p>Reserve appointments online at your preferred time without physical queues. Get instant confirmation and reminders.</p>
            <ul>
              <li>✓ Choose your preferred time slot</li>
              <li>✓ Instant email confirmations</li>
              <li>✓ Easy rescheduling & cancellation</li>
            </ul>
          </div>

          <div className="feature">
            <div className="feature-num">02</div>
            <h3>Real-Time Queue Tracking</h3>
            <p>See your queue position, wait time, and when you're being called. Stay informed every step of the way.</p>
            <ul>
              <li>✓ Live queue updates</li>
              <li>✓ Estimated wait times</li>
              <li>✓ Notifications when it's your turn</li>
            </ul>
          </div>

          <div className="feature">
            <div className="feature-num">03</div>
            <h3>Department Management</h3>
            <p>Admins can manage queues, serve students, and analyze traffic patterns in real-time.</p>
            <ul>
              <li>✓ Call next student</li>
              <li>✓ Mark tasks complete</li>
              <li>✓ View analytics dashboard</li>
            </ul>
          </div>

          <div className="feature">
            <div className="feature-num">04</div>
            <h3>Feedback & Ratings</h3>
            <p>Submit feedback after each visit to help us improve service quality continuously.</p>
            <ul>
              <li>✓ Rate your experience</li>
              <li>✓ Leave detailed feedback</li>
              <li>✓ Help improve services</li>
            </ul>
          </div>

          <div className="feature">
            <div className="feature-num">05</div>
            <h3>Multi-Department Support</h3>
            <p>Book appointments across all campus departments from one unified platform.</p>
            <ul>
              <li>✓ 8+ department types</li>
              <li>✓ Different service types</li>
              <li>✓ Centralized management</li>
            </ul>
          </div>

          <div className="feature">
            <div className="feature-num">06</div>
            <h3>Mobile Optimized</h3>
            <p>Fully responsive design works seamlessly on phones, tablets, and desktops.</p>
            <ul>
              <li>✓ Mobile-first design</li>
              <li>✓ Fast & lightweight</li>
              <li>✓ Works offline</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="departments-section">
        <h2>Campus Departments We Serve</h2>
        <div className="departments-grid">
          <div className="dept-item">
            <div className="dept-icon">📚</div>
            <h4>Registrar</h4>
            <p>Academic records & enrollment</p>
          </div>
          <div className="dept-item">
            <div className="dept-icon">💰</div>
            <h4>Finance / Fees Office</h4>
            <p>Payments & billing issues</p>
          </div>
          <div className="dept-item">
            <div className="dept-icon">💻</div>
            <h4>ICT / Technical Support</h4>
            <p>Technical assistance</p>
          </div>
          <div className="dept-item">
            <div className="dept-icon">📖</div>
            <h4>Library Services</h4>
            <p>Learning resources</p>
          </div>
          <div className="dept-item">
            <div className="dept-icon">⚕️</div>
            <h4>Health Unit</h4>
            <p>Healthcare & wellness</p>
          </div>
          <div className="dept-item">
            <div className="dept-icon">🎓</div>
            <h4>Student Affairs</h4>
            <p>Welfare & accommodation</p>
          </div>
          <div className="dept-item">
            <div className="dept-icon">📝</div>
            <h4>Examination Office</h4>
            <p>Assessment records</p>
          </div>
          <div className="dept-item">
            <div className="dept-icon">🎯</div>
            <h4>Admissions Office</h4>
            <p>Admission processes</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your account in seconds with your email</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Book Appointment</h3>
            <p>Choose department, date & time</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Confirmed</h3>
            <p>Receive confirmation & reminders</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Track Queue</h3>
            <p>See real-time updates & wait time</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Skip the Queue?</h2>
        <p>Join thousands of students already using InstaQueue to manage their time better.</p>
        <div className="cta-buttons">
          <button className="btn btn-primary-large" onClick={() => navigate('/register')}>
            Create Free Account Now
          </button>
          <button className="btn btn-secondary-large" onClick={() => navigate('/login')}>
            Sign In to Your Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>InstaQueue</h4>
            <p>Smart campus queue management for modern universities.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#departments">Departments</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>support@instaqueue.local</p>
            <p>+1 (555) 123-4567</p>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 InstaQueue. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
