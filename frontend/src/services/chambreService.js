import api from '../config/api';

export const chambreService = {
    getAll: () => api.get('/chambres'),
    getById: (id) => api.get(`/chambres/${id}`),
    create: (data) => api.post('/chambres', data),
    update: (id, data) => api.put(`/chambres/${id}`, data),
    delete: (id) => api.delete(`/chambres/${id}`)
}; 