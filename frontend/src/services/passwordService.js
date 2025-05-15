import api from '../config/api';

export const passwordService = {
    requestResetLink: (email) => api.post('/password/reset-link', { email }),
    resetPassword: (data) => api.post('/password/reset', data)
}; 