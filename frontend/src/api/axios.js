import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

// Create axios instance with base URL
const instance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Request interceptor for adding token to requests
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Debug token for development
      if (process.env.NODE_ENV !== 'production') {
        console.log('Request with token:', config.url);
      }
    } else {
      // Debug missing token
      if (process.env.NODE_ENV !== 'production') {
        console.log('Request without token:', config.url);
      }
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        console.error('Authentication error:', data);
        removeToken();
        localStorage.removeItem('user');
        window.dispatchEvent(new CustomEvent('auth:expired'));
        return Promise.reject(new Error('Your session has expired. Please login again.'));
        
      case 403:
        console.error('Authorization error:', data);
        // Check if token is invalid or just insufficient permissions
        const errorMessage = data?.message || 'You do not have permission to perform this action.';
        
        // Log the full error response for debugging
        console.log('Full 403 response:', error.response);
        
        return Promise.reject(new Error(errorMessage));
        
      case 404:
        return Promise.reject(new Error('The requested resource was not found.'));
        
      case 500:
        return Promise.reject(new Error('Server error. Please try again later.'));
        
      default:
        return Promise.reject(error);
    }
  }
);

export default instance;