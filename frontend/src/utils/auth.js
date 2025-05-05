// src/utils/auth.js

export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => localStorage.setItem('token', token);

export const removeToken = () => localStorage.removeItem('token');

// Helper function to check if user is authenticated
export const isAuthenticated = () => !!getToken();