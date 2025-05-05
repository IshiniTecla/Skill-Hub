// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
            navigate('/feed');
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-12">
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="px-6 py-8 sm:p-10">
                        <div className="flex justify-center mb-6">
                            <svg width="60" height="60" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
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
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Create your account</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                                    {error}
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={userData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={userData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    value={userData.username}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    value={userData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={userData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={userData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating account...
                                        </>
                                    ) : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:px-10">
                        <p className="text-sm text-center text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;