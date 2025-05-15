import axios from 'axios';

const API_URL = 'http://localhost:3000/api/rooms';

const roomService = {
  getAllRooms: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des chambres:', error);
      throw error;
    }
  },

  getRoomById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la chambre ${id}:`, error);
      throw error;
    }
  },

  createRoom: async (roomData) => {
    try {
      const response = await axios.post(API_URL, roomData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la chambre:', error);
      throw error;
    }
  },

  updateRoom: async (id, roomData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, roomData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la chambre ${id}:`, error);
      throw error;
    }
  },

  deleteRoom: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la chambre ${id}:`, error);
      throw error;
    }
  },

  updateRoomStatus: async (id, status) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de la chambre ${id}:`, error);
      throw error;
    }
  },

  getRoomsByStatus: async (status) => {
    try {
      const response = await axios.get(`${API_URL}/status/${status}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des chambres avec le statut ${status}:`, error);
      throw error;
    }
  }
};

export default roomService; 