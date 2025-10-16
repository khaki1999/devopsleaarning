import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const VariantService = {
  async fetchVariantTypes() {
    try {
      const response = await axios.get(`${API_URL}/variantTypes/`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching variant types:', error);
      throw error;
    }
  },

  async fetchVariants() {
    try {
      const response = await axios.get(`${API_URL}/variants/`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching variants:', error);
      throw error;
    }
  },

  async addVariant(variantData) {
    try {
      const response = await axios.post(`${API_URL}/variants/`, variantData);
      return response.data;
    } catch (error) {
      console.error('Error adding variant:', error);
      throw error;
    }
  },

  async updateVariant(variantId, variantData) {
    try {
      const response = await axios.put(`${API_URL}/variants/${variantId}`, variantData);
      return response.data;
    } catch (error) {
      console.error('Error updating variant:', error);
      throw error;
    }
  },

  async deleteVariant(variantId) {
    try {
      const response = await axios.delete(`${API_URL}/variants/${variantId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting variant:', error);
      throw error;
    }
  }
};

export default VariantService;
