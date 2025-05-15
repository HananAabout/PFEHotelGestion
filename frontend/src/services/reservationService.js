import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const reservationService = {
  getAllReservations: async () => {
    try {
      const response = await axios.get(`${API_URL}/reservations`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getReservationById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/reservations/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createReservation: async (reservationData) => {
    try {
      const response = await axios.post(`${API_URL}/reservations`, reservationData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateReservation: async (id, reservationData) => {
    try {
      const response = await axios.put(`${API_URL}/reservations/${id}`, reservationData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteReservation: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/reservations/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateReservationStatus: async (id, status) => {
    try {
      const response = await axios.patch(`${API_URL}/reservations/${id}/statut`, { statut: status });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getClientReservations: async (clientId) => {
    try {
      const response = await axios.get(`${API_URL}/clients/${clientId}/reservations`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAvailableRooms: async (dateArrivee, dateDepart) => {
    try {
      const response = await axios.get(`${API_URL}/chambres/disponibles`, {
        params: { dateArrivee, dateDepart }
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default reservationService; 