import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const NotificationService = {
  async fetchNotifications() {
    try {
      const response = await axios.get(`${API_URL}/notification/allnotification`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  async addNotification(notificationData) {
    try {
      const response = await axios.post(`${API_URL}/notification/sendnotification`, notificationData);
      return response.data;
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  },

  async updateNotification(notificationId, notificationData) {
    try {
      const response = await axios.put(`${API_URL}/notification/${notificationId}`, notificationData);
      return response.data;
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  },

  async deleteNotification(notificationId) {
    try {
      const response = await axios.delete(`${API_URL}/notification/deletenotification/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
};

export default NotificationService;
