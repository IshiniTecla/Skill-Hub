import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import {
  getToken,
  setToken,
  removeToken,
  isAuthenticated,
} from "../utils/auth";
import { authApi, userApi } from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate(); // Add navigation hook
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (isAuthenticated()) {
          const storedUser = localStorage.getItem("user");

          if (storedUser) {
            // Use stored user data
            setCurrentUser(JSON.parse(storedUser));
          } else {
            // If we have a token but no stored user, fetch profile
            const response = await userApi.getCurrentProfile();
            setCurrentUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
          }
        }
      } catch (err) {
        console.error("Error loading user:", err);
        // Clear invalid auth state
        removeToken();
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Listen for auth expiry events
    const handleAuthExpired = () => {
      logout();
      setError("Your session has expired. Please log in again.");
    };

    window.addEventListener("auth:expired", handleAuthExpired);

    return () => {
      window.removeEventListener("auth:expired", handleAuthExpired);
    };
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authApi.login({ email, password });

      // Extract token and user data
      const { token, ...userData } = response.data;

      // Store auth data
      setToken(token);
      setCurrentUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password. Please try again.");
      throw err;
    }
  };

  const logout = () => {
    authApi.logout(); // This handles token removal
    setCurrentUser(null);
    setError(null);
  };

  const register = async (userData) => {
    try {
      setError(null);
      // Using the authApi.register function from your axios file
      const response = await authApi.register(userData);

      // After successful registration, redirect to login page
      navigate("/login");
      
      return response.data;
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register. Please try again.");
      throw err;
    }
  };

  const updateProfile = async (userId, profileData) => {
    try {
      setError(null);
      const response = await userApi.updateUser(userId, profileData);
      setCurrentUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.message || "Failed to update profile. Please try again.");
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
    setError,
    isAuthenticated: !!currentUser && isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};