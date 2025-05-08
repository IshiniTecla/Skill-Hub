// src/utils/auth.js

// Get token from localStorage with better error handling
export const getToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Optional: Add token validation check here (expiry, format, etc.)
    // For JWT, you could check if it's expired by decoding it
    
    return token;
  } catch (error) {
    console.error('Error accessing token:', error);
    return null;
  }
};

// Set token with expiry tracking if needed
export const setToken = (token) => {
  try {
    localStorage.setItem('token', token);
    
    // Optional: Store token issue time for expiry calculations
    localStorage.setItem('token_issued_at', Date.now().toString());
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// Remove all auth data
export const removeToken = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('token_issued_at');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Helper to check if token might be expired (optional enhancement)
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  
  // For simple timeout-based expiry (e.g., 24 hours)
  const issuedAt = localStorage.getItem('token_issued_at');
  if (issuedAt) {
    const tokenAge = Date.now() - parseInt(issuedAt);
    const MAX_TOKEN_AGE = 24 * 60 * 60 * 1000; // 24 hours
    return tokenAge > MAX_TOKEN_AGE;
  }
  
  return false;
};