import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const userService = {
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/utilisateurs`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/utilisateurs/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/utilisateurs`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(`${API_URL}/utilisateurs/${id}`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/utilisateurs/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateUserRole: async (id, role) => {
    try {
      const response = await axios.patch(`${API_URL}/utilisateurs/${id}/role`, { role });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateUserPassword: async (id, password) => {
    try {
      const response = await axios.patch(`${API_URL}/utilisateurs/${id}/password`, { password });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/utilisateurs/current`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default userService; 