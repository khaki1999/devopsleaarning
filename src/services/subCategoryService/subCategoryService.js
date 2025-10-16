import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const SubCategoryService = {
  async fetchCategories() {
    try {
      const response = await axios.get(`${API_URL}/categories/`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async fetchSubCategories() {
    try {
      const response = await axios.get(`${API_URL}/subCategories/`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw error;
    }
  },

  async addSubCategory(subCategoryData) {
    try {
      const response = await axios.post(`${API_URL}/subCategories/`, subCategoryData);
      return response.data;
    } catch (error) {
      console.error('Error adding subcategory:', error);
      throw error;
    }
  },

  async updateSubCategory(subCategoryId, subCategoryData) {
    try {
      const response = await axios.put(`${API_URL}/subCategories/${subCategoryId}`, subCategoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating subcategory:', error);
      throw error;
    }
  },

  async deleteSubCategory(subCategoryId) {
    try {
      const response = await axios.delete(`${API_URL}/subCategories/${subCategoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      throw error;
    }
  }
};

export default SubCategoryService;
