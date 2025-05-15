import api from '../config/api';

export const paiementService = {
    getAll: () => api.get('/paiements'),
    getById: (id) => api.get(`/paiements/${id}`),
    create: (data) => api.post('/paiements', data),
    update: (id, data) => api.put(`/paiements/${id}`, data),
    delete: (id) => api.delete(`/paiements/${id}`)
}; 