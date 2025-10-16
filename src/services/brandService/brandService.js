// services/brandService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const BrandService = {
  async fetchSubcategories() {
    try {
      const response = await axios.get(`${API_URL}/subCategories/`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw error;
    }
  },

  async fetchBrands() {
    try {
      const response = await axios.get(`${API_URL}/brands/`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  },

  async addBrand(brandData) {
    try {
      const response = await axios.post(`${API_URL}/brands/`, brandData);
      return response.data;
    } catch (error) {
      console.error('Error adding brand:', error);
      throw error;
    }
  },

  async updateBrand(brandId, brandData) {
    try {
      const response = await axios.put(`${API_URL}/brands/${brandId}`, brandData);
      return response.data;
    } catch (error) {
      console.error('Error updating brand:', error);
      throw error;
    }
  },

  async deleteBrand(brandId) {
    try {
      const response = await axios.delete(`${API_URL}/brands/${brandId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting brand:', error);
      throw error;
    }
  }
};

export default BrandService;
