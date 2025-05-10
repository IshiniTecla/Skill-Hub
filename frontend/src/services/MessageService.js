import axios from 'axios';
import { getAuthHeader } from '../utils/authUtils';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class MessageService {
  async getGroupMessages(groupId) {
    try {
      const response = await axios.get(
        `${API_URL}/messages/group/${groupId}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching group messages:', error);
      throw error;
    }
  }

  async sendMessage(messageData) {
    try {
      const response = await axios.post(
        `${API_URL}/messages`,
        messageData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async updateMessage(messageId, messageData) {
    try {
      const response = await axios.put(
        `${API_URL}/messages/${messageId}`,
        messageData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  }

  async deleteMessage(messageId) {
    try {
      const response = await axios.delete(
        `${API_URL}/messages/${messageId}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Get messages for a specific user
  async getUserMessages(userId) {
    try {
      const response = await axios.get(
        `${API_URL}/messages/user/${userId}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user messages:', error);
      throw error;
    }
  }
}

export default new MessageService();