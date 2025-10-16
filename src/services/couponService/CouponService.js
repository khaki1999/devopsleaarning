import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const CouponService = {
  async fetchCoupons() {
    try {
      const response = await axios.get(`${API_URL}/couponCodes`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch coupons', error);
      throw error;
    }
  },

  async addCoupon(couponData) {
    try {
      const response = await axios.post(`${API_URL}/couponCodes`, couponData);
      return response.data;
    } catch (error) {
      console.error('Error adding coupon:', error);
      throw error;
    }
  },

  async updateCoupon(couponId, couponData) {
    try {
      const response = await axios.put(`${API_URL}/couponCodes/${couponId}`, couponData);
      return response.data;
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  },

  async deleteCoupon(couponId) {
    try {
      const response = await axios.delete(`${API_URL}/couponCodes/${couponId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete coupon', error);
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
      const response = await axios.get(`${API_URL}/subcategories`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw error;
    }
  },

  async fetchProducts() {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
};

export default CouponService;
