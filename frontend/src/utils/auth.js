// src/utils/auth.js
// Simple auth utility for handling tokens and user data

// Store user data in localStorage
export const setUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  // Store token in localStorage
  export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  // Get user data from localStorage
  export const getUser = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };
  
  // Get token from localStorage
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Check if user is authenticated
  export const isAuthenticated = () => {
    return !!getToken();
  };
  
  // Logout user by clearing localStorage
  export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };
  
  // Parse JWT token
  export const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };
  
  // Check if token is expired
  export const isTokenExpired = (token) => {
    const decoded = parseJwt(token);
    if (!decoded) return true;
    
    // Check if expiration time is past current time
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };