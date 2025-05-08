import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken, removeToken } from '../utils/auth';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setTokenState] = useState(getToken());

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = getToken();
      
      if (storedUser && storedToken) {
        setCurrentUser(JSON.parse(storedUser));
        setTokenState(storedToken);
      }
      
      setLoading(false);
    };

    loadUser();
    
    // Listen for auth expiry events
    const handleAuthExpired = () => {
      logout();
    };
    
    window.addEventListener('auth:expired', handleAuthExpired);
    
    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      // Store token and user info
      setToken(token);
      setTokenState(token);
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set token in API service
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear auth state
    removeToken();
    localStorage.removeItem('user');
    setCurrentUser(null);
    setTokenState(null);
    
    // Clear token from API service
    delete api.defaults.headers.common['Authorization'];
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Debug function to verify token validity
  const verifyToken = async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data.valid;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    verifyToken,
    token, // Explicitly expose the token for debugging
    isAuthenticated: !!currentUser && !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};