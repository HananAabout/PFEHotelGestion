import api from '../config/api';

export const authService = {
    register: async (userData) => {
        console.log('Envoi de la requête d\'inscription...');
        try {
            const response = await api.post('/register', userData);
            return response.data;
        } catch (error) {
            console.error('Erreur dans authService:', error);
            throw error;
        }
    },
    
    // Ajoute la gestion de l'utilisateur courant et de l'authentification
    isAuthenticated: () => {
        // Vérifie si le token existe dans le localStorage
        return !!localStorage.getItem('auth_token');
    },
    getCurrentUser: () => {
        // Récupère l'utilisateur courant depuis le localStorage (s'il a été stocké)
        const user = localStorage.getItem('current_user');
        if (user) {
            try {
                return JSON.parse(user);
            } catch {
                return null;
            }
        }
        return null;
    },
    setCurrentUser: (user) => {
        // Stocke l'utilisateur courant dans le localStorage
        if (user) {
            localStorage.setItem('current_user', JSON.stringify(user));
        }
    },

    login: async (credentials) => {
        // Affichage des informations envoyées (sans le mot de passe complet)
        console.log('Données d\'authentification envoyées:', {
            email: credentials.email,
            passwordProvided: !!credentials.password
        });
        
        try {
            // Envoi des données avec le format attendu par le backend (password au lieu de mot_de_passe)
            const response = await api.post('/login', {
                email: credentials.email,
                password: credentials.password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            // Log de la réponse réussie (sans données sensibles)
            console.log('Connexion réussie, réponse:', {
                status: response.status,
                userReceived: !!response.data.user,
                tokenReceived: !!response.data.token
            });

            // Stocke l'utilisateur courant dans le localStorage
            if (response.data.user) {
                authService.setCurrentUser(response.data.user);
            }
            
            return response.data;
        } catch (error) {
            console.error('Erreur de connexion détaillée:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            
            if (!error.response) {
                throw {
                    message: 'Le serveur n\'est pas accessible. Veuillez vérifier votre connexion.',
                    status: 'network_error'
                };
            }
            
            if (error.response?.status === 401) {
                throw {
                    message: 'Email ou mot de passe incorrect',
                    status: error.response.status,
                    data: error.response.data
                };
            }
            
            throw {
                message: 'Une erreur est survenue lors de la connexion',
                status: error.response?.status,
                data: error.response?.data
            };
        }
    },
    // Ajoute la gestion de la déconnexion
    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
    }
};