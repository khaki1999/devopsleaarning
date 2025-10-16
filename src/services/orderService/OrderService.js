import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const OrderService = {
  async fetchOrders() {
    try {
      const response = await axios.get(`${API_URL}/orders/`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async updateOrder(orderId, orderData) {
    try {
      const response = await axios.put(`${API_URL}/orders/${orderId}`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  async deleteOrder(orderId) {
    try {
      const response = await axios.delete(`${API_URL}/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
};

export default OrderService;
