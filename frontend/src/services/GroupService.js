// GroupService.js
import api from '../api/axios';

const GroupService = {
  getAllGroups: async () => {
    try {
      const response = await api.get('/api/groups');
      return response.data;
    } catch (error) {
      console.error('Error fetching all groups:', error);
      throw error.response?.data?.error || 'Failed to fetch groups';
    }
  },

  getGroupById: async (id) => {
    try {
      const response = await api.get(`/api/groups/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching group ${id}:`, error);
      throw error.response?.data?.error || 'Failed to fetch group details';
    }
  },

  getGroupsByOwner: async (ownerId) => {
    try {
      const response = await api.get(`/api/groups/owner/${ownerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching owned groups:`, error);
      throw error.response?.data?.error || 'Failed to fetch owned groups';
    }
  },

  getGroupsByMember: async (userId) => {
    try {
      const response = await api.get(`/api/groups/member/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching member groups:`, error);
      throw error.response?.data?.error || 'Failed to fetch member groups';
    }
  },

  createGroup: async (groupData) => {
    try {
      const response = await api.post('/api/groups', groupData);
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error.response?.data?.error || 'Failed to create group';
    }
  },

  updateGroup: async (id, groupData) => {
    try {
      const response = await api.put(`/api/groups/${id}`, groupData);
      return response.data;
    } catch (error) {
      console.error(`Error updating group ${id}:`, error);
      throw error.response?.data?.error || 'Failed to update group';
    }
  },

  deleteGroup: async (id) => {
    try {
      const response = await api.delete(`/api/groups/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting group ${id}:`, error);
      throw error.response?.data?.error || 'Failed to delete group';
    }
  },

  joinGroup: async (groupId) => {
    try {
      const response = await api.post(`/api/groups/${groupId}/join`);
      return response.data;
    } catch (error) {
      console.error(`Error joining group ${groupId}:`, error);
      throw error.response?.data?.error || 'Failed to join group';
    }
  },

  leaveGroup: async (groupId) => {
    try {
      const response = await api.post(`/api/groups/${groupId}/leave`);
      return response.data;
    } catch (error) {
      console.error(`Error leaving group ${groupId}:`, error);
      throw error.response?.data?.error || 'Failed to leave group';
    }
  },

  addMember: async (groupId, userId) => {
    try {
      const response = await api.post(`/api/groups/${groupId}/add-member/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error adding member to group ${groupId}:`, error);
      throw error.response?.data?.error || 'Failed to add member';
    }
  },

  removeMember: async (groupId, userId) => {
    try {
      const response = await api.post(`/api/groups/${groupId}/remove-member/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing member from group ${groupId}:`, error);
      throw error.response?.data?.error || 'Failed to remove member';
    }
  },

  transferOwnership: async (groupId, newOwnerId) => {
    try {
      const response = await api.post(`/api/groups/${groupId}/transfer-ownership/${newOwnerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error transferring ownership of group ${groupId}:`, error);
      throw error.response?.data?.error || 'Failed to transfer ownership';
    }
  },

  getGroupMembers: async (groupId) => {
    try {
      const response = await api.get(`/api/groups/${groupId}/members`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching members of group ${groupId}:`, error);
      throw error.response?.data?.error || 'Failed to fetch group members';
    }
  }
};

export default GroupService;