// src/api/axios.js
import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

// Create axios instance with base URL and withCredentials option
const instance = axios.create({
  baseURL: 'http://localhost:8080/api', // Make sure this matches your Spring Boot API path
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
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Improved error handling
    if (!error.response) {
      console.error('Network Error:', error);
      // You could show a user-friendly message here
    } else {
      console.error('API Error:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        // Token is expired or invalid
        removeToken();
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;