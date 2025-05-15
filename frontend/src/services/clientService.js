import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const clientService = {
  getAllClients: async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getClientById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/clients/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createClient: async (clientData) => {
    try {
      const response = await axios.post(`${API_URL}/clients`, clientData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateClient: async (id, clientData) => {
    try {
      const response = await axios.put(`${API_URL}/clients/${id}`, clientData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteClient: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/clients/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  searchClients: async (searchTerm) => {
    try {
      const response = await axios.get(`${API_URL}/clients/search`, {
        params: { q: searchTerm }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getClientHistory: async (clientId) => {
    try {
      const response = await axios.get(`${API_URL}/clients/${clientId}/historique`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default clientService; 