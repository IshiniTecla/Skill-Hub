import api from '../api/axios';

const UserService = {
  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Search users by term (name, email, etc.)
  searchUsers: async (searchTerm) => {
    try {
      const response = await api.get(`/users/search?term=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update user skills
  updateSkills: async (skills) => {
    try {
      const response = await api.put('/users/skills', { skills });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get users by skill
  getUsersBySkill: async (skillId) => {
    try {
      const response = await api.get(`/users/skill/${skillId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default UserService;