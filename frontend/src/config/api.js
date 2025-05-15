import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    response => response,
    error => {
        if (!error.response) {
            throw new Error("Le serveur n'est pas accessible. Veuillez vérifier que le serveur Laravel est en cours d'exécution.");
        }
        throw error;
    }
);

export default api;