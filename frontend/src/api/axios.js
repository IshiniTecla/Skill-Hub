// src/api/axios.js
import axios from 'axios';

// Helper functions for token management
const getToken = () => localStorage.getItem('token');
const removeToken = () => localStorage.removeItem('token');

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Request interceptor for adding token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    // Add cache-busting parameter for image requests to prevent 404s due to caching
    if (config.url && (config.url.includes('/profile-image') || config.url.includes('/image'))) {
      // For image requests, set responseType to blob
      config.responseType = 'blob';
      
      // Add timestamp to URL to prevent caching
      const separator = config.url.includes('?') ? '&' : '?';
      config.url = `${config.url}${separator}t=${Date.now()}`;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
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
        // Only clear auth and redirect if this isn't already a login request
        if (!error.config.url.includes('/api/auth/')) {
          removeToken();
          localStorage.removeItem('user');
          window.dispatchEvent(new CustomEvent('auth:expired'));
        }
        return Promise.reject(new Error(data?.message || 'Your session has expired. Please login again.'));
        
      case 403:
        console.error('Authorization error:', error.config.url);
        // For 403 errors, we'll still return an empty result rather than rejecting
        if (error.config.url.includes('/api/posts/user/')) {
          console.warn('Handling 403 for posts request by returning empty array');
          return Promise.resolve({ data: [] });
        }
        return Promise.reject(new Error(data?.message || 'You do not have permission to perform this action.'));
        
      case 404:
        console.error('Not found error:', error.config.url);
        // For 404 on image requests, return a default image or empty blob
        if (error.config.url.includes('/profile-image') || error.config.url.includes('/image')) {
          console.warn('Image not found, returning empty response');
          return Promise.resolve({ 
            data: new Blob(),
            status: 200
          });
        }
        return Promise.reject(new Error(data?.message || 'The requested resource was not found.'));
        
      case 500:
        return Promise.reject(new Error(data?.message || 'Server error. Please try again later.'));
        
      default:
        return Promise.reject(error);
    }
  }
);

// User APIs
const userApi = {
  getCurrentProfile: () => api.get('/api/users/profile'),
  getUserById: (id) => api.get(`/api/users/${id}`),
  getUserByUsername: (username) => api.get(`/api/users/username/${username}`),
  updateUser: (id, userData) => api.put(`/api/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
  getProfileImage: (id) => api.get(`/api/users/${id}/profile-image`, { responseType: 'blob' }),
  uploadProfileImage: (id, formData) => api.post(`/api/users/${id}/upload-profile-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }),
  getFollowers: (id) => api.get(`/api/users/${id}/followers`),
  getFollowing: (id) => api.get(`/api/users/${id}/following`),
  followUser: (userId, targetId) => api.post(`/api/users/${userId}/follow/${targetId}`),
  unfollowUser: (userId, targetId) => api.post(`/api/users/${userId}/unfollow/${targetId}`),
  removeFollower: (userId, followerId) => api.post(`/api/users/${userId}/remove-follower/${followerId}`)
};

// Posts APIs
const postApi = {
  getUserPosts: async (userId) => {
    try {
      return await api.get(`/api/posts/user/${userId}`);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Return empty array instead of rejecting to prevent breaking the UI
      return { data: [] };
    }
  },
  getSavedPosts: async () => {
    try {
      return await api.get('/api/posts/saved');
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      return { data: [] };
    }
  },
  savePost: (postId) => api.post(`/api/posts/${postId}/save`),
  unsavePost: (postId) => api.post(`/api/posts/${postId}/unsave`),
  deletePost: (postId) => api.delete(`/api/posts/${postId}`),
  getPostImage: (postId) => api.get(`/api/posts/${postId}/image`, { responseType: 'blob' })
};

// Auth APIs
const authApi = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => {
    removeToken();
    localStorage.removeItem('user');
  }
};

export { api as default, userApi, postApi, authApi };