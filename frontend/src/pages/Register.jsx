// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/register.css';

const Register = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const { register, error, currentUser } = useAuth();
    const navigate = useNavigate();

    // If user is already logged in, redirect to feed
    useEffect(() => {
        if (currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const validateForm = () => {
        // Basic validation
        if (!userData.username || !userData.email || !userData.password || !userData.firstName || !userData.lastName) {
            return { isValid: false, message: 'All fields are required' };
        }
        
        if (userData.password !== userData.confirmPassword) {
            return { isValid: false, message: 'Passwords do not match' };
        }
        
        if (userData.password.length < 6) {
            return { isValid: false, message: 'Password must be at least 6 characters' };
        }
        
        return { isValid: true };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validation = validateForm();
        if (!validation.isValid) {
            alert(validation.message);
            return;
        }
        
        try {
            setIsLoading(true);
            // Remove confirmPassword as it's not needed for registration
            const { confirmPassword, ...registrationData } = userData;
            await register(registrationData);
            navigate('/login', { state: { message: 'Registration successful. Please log in.' } });
        } catch (err) {
            console.error('Registration error:', err);
            // Error handled in AuthContext
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <div className="register-logo">
                        <svg width="60" height="60" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" className="register-logo-svg">
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
                    <h2 className="register-title">Create your account</h2>
                </div>
                
                <div className="register-form-container">
                    <form onSubmit={handleSubmit} className="register-form">
                        {error && (
                            <div className="register-error">
                                {error}
                            </div>
                        )}
                        
                        <div className="register-name-fields">
                            <div className="register-form-group">
                                <label htmlFor="firstName" className="register-label">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    className="register-input"
                                    value={userData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            
                            <div className="register-form-group">
                                <label htmlFor="lastName" className="register-label">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    className="register-input"
                                    value={userData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="username" className="register-label">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="register-input"
                                value={userData.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="email" className="register-label">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="register-input"
                                value={userData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="register-password-fields">
                            <div className="register-form-group">
                                <label htmlFor="password" className="register-label">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="register-input"
                                    value={userData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            
                            <div className="register-form-group">
                                <label htmlFor="confirmPassword" className="register-label">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="register-input"
                                    value={userData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="register-button-container">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`register-button ${isLoading ? 'register-button-loading' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="register-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="register-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="register-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </>
                                ) : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
                
                <div className="register-footer">
                    <p className="register-footer-text">
                        Already have an account?{' '}
                        <Link to="/login" className="register-link">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;