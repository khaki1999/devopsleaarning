import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const CategoryService = {
  async fetchCategories() {
    try {
      const response = await axios.get(`${API_URL}/categories/`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async addCategory(categoryData) {
    try {
      const response = await axios.post(`${API_URL}/categories/`, categoryData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  async updateCategory(categoryId, categoryData) {
    try {
      const response = await axios.put(`${API_URL}/categories/${categoryId}`, categoryData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  async deleteCategory(categoryId) {
    try {
      const response = await axios.delete(`${API_URL}/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};

export default CategoryService;
