import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const VariantTypeService = {
  async fetchVariantTypes() {
    try {
      const response = await axios.get(`${API_URL}/variantTypes/`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching variant types:', error);
      throw error;
    }
  },

  async addVariantType(variantTypeData) {
    try {
      const response = await axios.post(`${API_URL}/variantTypes/`, variantTypeData);
      return response.data;
    } catch (error) {
      console.error('Error adding variant type:', error);
      throw error;
    }
  },

  async updateVariantType(variantTypeId, variantTypeData) {
    try {
      const response = await axios.put(`${API_URL}/variantTypes/${variantTypeId}`, variantTypeData);
      return response.data;
    } catch (error) {
      console.error('Error updating variant type:', error);
      throw error;
    }
  },

  async deleteVariantType(variantTypeId) {
    try {
      const response = await axios.delete(`${API_URL}/variantTypes/${variantTypeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting variant type:', error);
      throw error;
    }
  }
};

export default VariantTypeService;
