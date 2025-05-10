// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, error, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get redirect path from location state or default to feed
    const from = location.state?.from?.pathname || '/feed';

    // If user is already logged in, redirect to feed
    useEffect(() => {
        if (currentUser) {
            navigate('/feed');
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            return; // Simple validation
        }
        
        try {
            setIsLoading(true);
            await login(email, password);
            // Navigation will happen automatically through the useEffect
        } catch (err) {
            console.error('Login error:', err);
            // Error is handled in AuthContext
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="Login-container">
            <div className="Login-card">
                <div className="Login-header">
                    <div className="Login-logo">
                        <svg width="60" height="60" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#4f46e5" />
                                    <stop offset="100%" stopColor="#10b981" />
                                </linearGradient>
                            </defs>
                            <circle cx="25" cy="25" r="22" fill="none" stroke="url(#logo-gradient)" strokeWidth="5" />
                            <circle cx="25" cy="12" r="5" fill="#4f46e5" />
                            <circle cx="15" cy="30" r="5" fill="#6366f1" />
                            <circle cx="35" cy="30" r="5" fill="#10b981" />
                            <line x1="25" y1="12" x2="15" y2="30" stroke="#6366f1" strokeWidth="2" />
                            <line x1="25" y1="12" x2="35" y2="30" stroke="#10b981" strokeWidth="2" />
                            <line x1="15" y1="30" x2="35" y2="30" stroke="#8b5cf6" strokeWidth="2" />
                        </svg>
                    </div>
                    <h2 className="Login-title">Sign in to your account</h2>
                </div>
                
                {location.state?.message && (
                    <div className="Login-alert Login-alert-success">
                        {location.state.message}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="Login-form">
                    {error && (
                        <div className="Login-alert Login-alert-error">
                            {error}
                        </div>
                    )}
                    
                    <div className="Login-form-group">
                        <label htmlFor="email" className="Login-label">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="Login-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="Login-form-group">
                        <label htmlFor="password" className="Login-label">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="Login-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="Login-options">
                        <div className="Login-remember">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="Login-checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember-me" className="Login-checkbox-label">
                                Remember me
                            </label>
                        </div>

                        <div className="Login-forgot">
                            <Link to="/forgot-password" className="Login-link">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`Login-button ${isLoading ? 'Login-button-loading' : ''}`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="Login-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="Login-spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="Login-spinner-head" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </>
                        ) : 'Sign in'}
                    </button>
                </form>
                
                <div className="Login-footer">
                    <p className="Login-footer-text">
                        Don't have an account?{' '}
                        <Link to="/register" className="Login-link">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;