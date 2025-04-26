// src/pages/LoginPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import '../styles/global.css';
import '../styles/auth.css';

const LoginPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="logo-container" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            <svg width="40" height="40" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="auth-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <circle cx="25" cy="25" r="22" fill="none" stroke="url(#auth-logo-gradient)" strokeWidth="5" />
              <circle cx="25" cy="12" r="5" fill="#4f46e5" />
              <circle cx="15" cy="30" r="5" fill="#6366f1" />
              <circle cx="35" cy="30" r="5" fill="#10b981" />
              <line x1="25" y1="12" x2="15" y2="30" stroke="#6366f1" strokeWidth="2" />
              <line x1="25" y1="12" x2="35" y2="30" stroke="#10b981" strokeWidth="2" />
              <line x1="15" y1="30" x2="35" y2="30" stroke="#8b5cf6" strokeWidth="2" />
            </svg>
            <span>SkillHub</span>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        <LoginForm />

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;