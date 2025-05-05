// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { setToken, getToken, removeToken } from '../utils/auth';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = getToken();
        if (token) {
          // Try to get user profile with token to verify it's still valid
          const userFromStorage = JSON.parse(localStorage.getItem('user'));
          setCurrentUser(userFromStorage);
          
          // Optional: Verify token with backend
          // await getUserProfile();
        }
      } catch (err) {
        console.error("Error loading user", err);
        logout(); // Token might be invalid, clear it
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      // Update these endpoints to match your Spring Security controller endpoints
      const response = await axios.post('/users/login', { email, password });
      const { token, user } = response.data;
      
      if (token) {
        setToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        return user;
      }
    } catch (err) {
      console.error("Login error", err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      // Update these endpoints to match your Spring Security controller endpoints
      const response = await axios.post('/users/register', userData);
      return response.data;
    } catch (err) {
      console.error("Registration error:", err);
      
      // More detailed error handling
      if (err.response) {
        setError(err.response.data?.message || `Registration failed with status ${err.response.status}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response received from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        setError(`Error setting up request: ${err.message}`);
      }
      
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    removeToken();
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      const response = await axios.get('/users/profile');
      setCurrentUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      console.error("Error fetching profile", err);
      if (err.response?.status === 401) {
        logout(); // Token expired
      }
      throw err;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/users/profile', profileData);
      setCurrentUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      console.error("Error updating profile", err);
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    getUserProfile,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};