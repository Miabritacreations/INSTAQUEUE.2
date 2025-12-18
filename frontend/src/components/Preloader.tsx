import React from 'react';
import '../styles/Preloader.css';

interface PreloaderProps {
  loading: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="preloader">
      {/* Animated background particles */}
      <div className="preloader-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>

      <div className="preloader-content">
        {/* Logo with animated queue icon */}
        <div className="preloader-logo">
          <div className="logo-container">
            <div className="queue-icon">
              <div className="queue-person queue-person-1"></div>
              <div className="queue-person queue-person-2"></div>
              <div className="queue-person queue-person-3"></div>
            </div>
            <div className="logo-text-wrapper">
              <h1 className="preloader-title">
                <span className="title-letter" style={{ animationDelay: '0s' }}>I</span>
                <span className="title-letter" style={{ animationDelay: '0.1s' }}>n</span>
                <span className="title-letter" style={{ animationDelay: '0.2s' }}>s</span>
                <span className="title-letter" style={{ animationDelay: '0.3s' }}>t</span>
                <span className="title-letter" style={{ animationDelay: '0.4s' }}>a</span>
                <span className="title-letter highlight" style={{ animationDelay: '0.5s' }}>Q</span>
                <span className="title-letter" style={{ animationDelay: '0.6s' }}>u</span>
                <span className="title-letter" style={{ animationDelay: '0.7s' }}>e</span>
                <span className="title-letter" style={{ animationDelay: '0.8s' }}>u</span>
                <span className="title-letter" style={{ animationDelay: '0.9s' }}>e</span>
              </h1>
              <p className="subtitle">Smart Campus Queue Management</p>
            </div>
          </div>
        </div>
        
        {/* Creative loading animation */}
        <div className="preloader-animation">
          <div className="loading-dots">
            <div className="dot dot-1"></div>
            <div className="dot dot-2"></div>
            <div className="dot dot-3"></div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
        
        <p className="preloader-text">
          <span className="loading-text">Preparing your dashboard</span>
          <span className="loading-dots-text">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Preloader;
