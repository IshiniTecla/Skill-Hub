// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API calls
export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
};

// User API calls
export const userAPI = {
  getCurrentUser: () => api.get('/users/profile'),
  getUserById: (userId) => api.get(`/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
  searchUsers: (params) => api.get('/users/search', { params }),
  followUser: (userId, targetId) => api.post(`/users/${userId}/follow/${targetId}`),
  unfollowUser: (userId, targetId) => api.post(`/users/${userId}/unfollow/${targetId}`),
  acceptFollowRequest: (userId, requesterId) => 
    api.post(`/users/${userId}/accept-follow/${requesterId}`),
  rejectFollowRequest: (userId, requesterId) => 
    api.post(`/users/${userId}/reject-follow/${requesterId}`),
};

export default api;