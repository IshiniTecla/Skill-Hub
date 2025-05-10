// src/services/UserService.js
import { userApi } from "../api/axios";

const UserService = {
  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await userApi.getCurrentProfile();
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await userApi.getUserById(userId);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  },

  // Search users by term (name, email, etc.)
  searchUsers: async (searchTerm) => {
    try {
      // Implement if you have a search endpoint
      // const response = await api.get(`/api/users/search?term=${encodeURIComponent(searchTerm)}`);
      // return response.data;
      throw new Error("Search functionality not implemented");
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  // Enhanced UserService methods for better error handling

  // In UserService.js - Enhanced updateProfile method
  updateProfile: async (userId, userData) => {
    try {
      // Validate input
      if (!userId) throw new Error("User ID is required");
      if (!userData) throw new Error("User data is required");

      // Add logging
      console.log(
        `Updating user ${userId} with data:`,
        JSON.stringify(userData)
      );

      // Use the userApi.updateUser method from your axios.js file
      const response = await userApi.updateUser(userId, userData);

      if (!response || !response.data) {
        throw new Error("No data returned from update operation");
      }

      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      // Transform error for better user feedback
      if (error.response?.status === 409) {
        throw new Error("Username already taken. Please choose another.");
      }
      throw error;
    }
  },

  // In UserService.js - Enhanced deleteAccount method
  deleteAccount: async (userId) => {
    try {
      // Validate input
      if (!userId) throw new Error("User ID is required");

      // Add logging
      console.log(`Deleting user account ${userId}`);

      // Use the userApi.deleteUser method from your axios.js file
      const response = await userApi.deleteUser(userId);

      return response.data;
    } catch (error) {
      console.error("Error deleting account:", error);

      // Transform error for better user feedback
      if (error.response?.status === 403) {
        throw new Error("You do not have permission to delete this account.");
      }

      throw error;
    }
  },

  // Update profile image
  uploadProfileImage: async (userId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await userApi.uploadProfileImage(userId, formData);
      return response.data;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw error;
    }
  },

  // Get profile image
  getProfileImage: async (userId) => {
    try {
      const response = await userApi.getProfileImage(userId);
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error fetching profile image:", error);
      return null;
    }
  },

  // Follow user
  followUser: async (userId, targetId) => {
    try {
      const response = await userApi.followUser(userId, targetId);
      return response.data;
    } catch (error) {
      console.error("Error following user:", error);
      throw error;
    }
  },

  // Unfollow user
  unfollowUser: async (userId, targetId) => {
    try {
      const response = await userApi.unfollowUser(userId, targetId);
      return response.data;
    } catch (error) {
      console.error("Error unfollowing user:", error);
      throw error;
    }
  },
};

export default UserService;
