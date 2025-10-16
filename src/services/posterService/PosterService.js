import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const PosterService = {
  async fetchPosters() {
    try {
      const response = await axios.get(`${API_URL}/posters`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch posters', error);
      throw error;
    }
  },

  async addPoster(posterData) {
    try {
      const response = await axios.post(`${API_URL}/posters`, posterData);
      return response.data;
    } catch (error) {
      console.error('Error adding poster:', error);
      throw error;
    }
  },

  async updatePoster(posterId, posterData) {
    try {
      const response = await axios.put(`${API_URL}/posters/${posterId}`, posterData);
      return response.data;
    } catch (error) {
      console.error('Error updating poster:', error);
      throw error;
    }
  },

  async deletePoster(posterId) {
    try {
      const response = await axios.delete(`${API_URL}/posters/${posterId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete poster', error);
      throw error;
    }
  }
};

export default PosterService;
