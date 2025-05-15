import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const paymentService = {
  getAllPayments: async () => {
    try {
      const response = await axios.get(`${API_URL}/paiements`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getPaymentById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/paiements/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createPayment: async (paymentData) => {
    try {
      const response = await axios.post(`${API_URL}/paiements`, paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updatePayment: async (id, paymentData) => {
    try {
      const response = await axios.put(`${API_URL}/paiements/${id}`, paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deletePayment: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/paiements/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  generateReceipt: async (paymentId) => {
    try {
      const response = await axios.get(`${API_URL}/paiements/${paymentId}/recu`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getReservationPayments: async (reservationId) => {
    try {
      const response = await axios.get(`${API_URL}/reservations/${reservationId}/paiements`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getPaymentStats: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_URL}/paiements/statistiques`, {
        params: { startDate, endDate }
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default paymentService; 