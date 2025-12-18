import React from 'react';
import '../styles/Preloader.css';

interface PreloaderProps {
  loading: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="preloader">
      <div className="preloader-content">
        <div className="preloader-logo">
          <div className="logo-circle">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" className="logo-circle-bg" />
              <path
                d="M30 50 L45 50 L45 30 L55 30 L55 70 L45 70 L45 60 L30 60 Z"
                className="logo-i"
                fill="currentColor"
              />
              <circle cx="70" cy="35" r="8" className="logo-q-dot" fill="currentColor" />
              <path
                d="M70 45 C75 45, 80 50, 80 55 C80 60, 75 65, 70 65 C65 65, 60 60, 60 55 C60 50, 65 45, 70 45 M72 62 L78 68"
                className="logo-q"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
          </div>
          <h1 className="preloader-title">InstaQueue</h1>
        </div>
        
        <div className="preloader-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        
        <p className="preloader-text">Loading your experience...</p>
      </div>
    </div>
  );
};

export default Preloader;
