import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const ProductService = {
  async fetchProducts() {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async addProduct(productData) {
    try {
      const response = await axios.post(`${API_URL}/products`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  async updateProduct(productId, productData) {
    try {
      const response = await axios.put(`${API_URL}/products/${productId}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(productId) {
    try {
      const response = await axios.delete(`${API_URL}/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async fetchCategories() {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async fetchSubCategories() {
    try {
      const response = await axios.get(`${API_URL}/subCategories`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw error;
    }
  },

  async fetchBrands() {
    try {
      const response = await axios.get(`${API_URL}/brands`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  },

  async fetchVariants() {
    try {
      const response = await axios.get(`${API_URL}/variantTypes`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching variants:', error);
      throw error;
    }
  }
};

export default ProductService;
