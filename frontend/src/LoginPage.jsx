// LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { authService } from './services/authService';
import { passwordService } from './services/passwordService';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [error, setError] = useState('');
  const [serverResponse, setServerResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Images d'arrière-plan améliorées - photos d'hôtels luxueux
  const backgroundImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBgIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 7000); // Transition plus lente

    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setServerResponse(null);
    setIsLoading(true);
    
    try {
      const response = await authService.login({ email, password });
      setServerResponse(response);
  
      if (response.user) {
        // Store the authentication token if provided
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
        // Navigation selon le rôle (insensible à la casse)
        const role = response.user.role?.toLowerCase();
        if (role === 'administrateur') {
          navigate('/admin-dashboard');
        } else if (role === 'réceptionniste' || role === 'receptionniste') {
          navigate('/reception-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
        // Enhanced error message handling
        let errorMessage;
        if (error.status === 401) {
            errorMessage = 'Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.';
        } else if (error.status === 'network_error') {
            errorMessage = 'Le serveur n\'est pas accessible. Veuillez vérifier votre connexion.';
        } else {
            errorMessage = error.message || 'Une erreur est survenue lors de la connexion.';
        }
        
        setError(errorMessage);
        setServerResponse({
            status: error.status,
            data: error.data,
            message: errorMessage
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await passwordService.requestResetLink(resetEmail);
      setResetMessage('Un email de réinitialisation a été envoyé à votre adresse email.');
      setResetEmail('');
    } catch (error) {
      setResetMessage(error.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Styles améliorés pour une apparence plus professionnelle
  const mainStyle = {
    backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh',
    minHeight: '100vh',
    minWidth: '100vw',
    transition: 'background-image 2s ease-in-out',
    position: 'fixed', // Fixe le background sur tout l'écran
    top: 0,
    left: 0,
    zIndex: 0
  };

  // Overlay sombre avec dégradé
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)',
    backdropFilter: 'blur(2px)'
  };

  // Logo style
  const logoStyle = {
    marginBottom: '1.5rem',
    fontFamily: '"Playfair Display", serif',
    fontWeight: 700,
    color: '#1a3c5b',
    position: 'relative'
  };

  // Logo décoration
  const logoDecorationStyle = {
    content: '""',
    position: 'absolute',
    width: '40px',
    height: '3px',
    backgroundColor: '#f8bb62',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)'
  };

  // Styles pour le formulaire et les boutons
  const cardStyle = {
    borderRadius: '15px',
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  };

  const formStyle = {
    padding: '2rem'
  };

  const inputStyle = {
    borderRadius: '8px',
    padding: '12px 15px',
    border: '1px solid #e1e1e1',
    transition: 'border-color 0.3s ease',
    fontSize: '16px'
  };

  const buttonStyle = {
    borderRadius: '8px',
    padding: '12px 15px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    backgroundColor: '#1a3c5b',
    borderColor: '#1a3c5b',
    boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)'
  };

  const linkStyle = {
    color: '#1a3c5b',
    fontWeight: '500',
    transition: 'color 0.3s ease'
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <main className="flex-grow-1 d-flex align-items-center justify-content-center" style={mainStyle}>
        <div style={overlayStyle}></div>
        <div className="container position-relative" style={{zIndex: 2}}>
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-6 col-xl-5">
              <div className="text-center mb-4">
                <h2 className="text-white mb-0" style={{fontWeight: 700, fontSize: '2.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
                  HotelManager
                </h2>
                <p className="text-white-50 mt-2" style={{textShadow: '0 1px 2px rgba(0,0,0,0.2)'}}>
                  Votre solution complète de gestion hôtelière
                </p>
              </div>
              
              <div className="card" style={cardStyle}>
                <div className="card-body p-0">
                  {isResetting ? (
                    <div style={formStyle}>
                      <h3 style={logoStyle} className="text-center">
                        Réinitialisation
                        <div style={logoDecorationStyle}></div>
                      </h3>
                      
                      {resetMessage && (
                        <div className="alert alert-info mb-4" style={{borderRadius: '8px'}}>
                          {resetMessage}
                        </div>
                      )}
                      
                      <form onSubmit={handleResetPassword}>
                        <div className="mb-4">
                          <label htmlFor="resetEmail" className="form-label fw-medium mb-2">Adresse email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="resetEmail"
                            placeholder="Entrez votre adresse email"
                            style={inputStyle}
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div className="d-grid gap-2 mb-3">
                          <button 
                            type="submit" 
                            className="btn btn-primary btn-lg"
                            style={buttonStyle}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Envoi en cours...
                              </span>
                            ) : (
                              "Envoyer le lien de réinitialisation"
                            )}
                          </button>
                        </div>
                        
                        <div className="text-center mt-4">
                          <button
                            type="button"
                            className="btn btn-link text-decoration-none"
                            style={linkStyle}
                            onClick={() => {
                              setIsResetting(false);
                              setResetMessage('');
                            }}
                            disabled={isLoading}
                          >
                            <i className="bi bi-arrow-left me-1"></i> Retour à la connexion
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div style={formStyle}>
                      <h3 style={logoStyle} className="text-center">
                        Connexion
                        <div style={logoDecorationStyle}></div>
                      </h3>
                      
                      {error && (
                        <div className="alert alert-danger mb-4" style={{borderRadius: '8px'}}>
                          {error}
                        </div>
                      )}

                      {serverResponse && (
                        <div className="alert alert-info mb-4" style={{borderRadius: '8px', fontSize: '0.9rem'}}>
                          <h5 className="alert-heading">Détails de l'erreur</h5>
                          <hr />
                          <pre style={{fontSize: '0.8rem'}}>{JSON.stringify(serverResponse, null, 2)}</pre>
                        </div>
                      )}
                      
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label htmlFor="email" className="form-label fw-medium mb-2">Adresse email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Entrez votre adresse email"
                            style={inputStyle}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div className="mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <label htmlFor="password" className="form-label fw-medium mb-0">Mot de passe</label>
                            <button
                              type="button"
                              className="btn btn-link p-0 text-decoration-none"
                              style={{...linkStyle, fontSize: '0.875rem'}}
                              onClick={() => setIsResetting(true)}
                              disabled={isLoading}
                            >
                              Mot de passe oublié ?
                            </button>
                          </div>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Entrez votre mot de passe"
                            style={inputStyle}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div className="d-grid gap-2 mb-4">
                          <button 
                            type="submit" 
                            className="btn btn-primary btn-lg"
                            style={buttonStyle}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Connexion en cours...
                              </span>
                            ) : (
                              "Se connecter"
                            )}
                          </button>
                        </div>
                        
                        <div className="text-center">
                          <p className="mb-0">
                            Pas encore de compte ? {' '}
                            <a
                              href="/register"
                              className="text-decoration-none fw-medium"
                              style={linkStyle}
                            >
                              Créer un compte
                            </a>
                          </p>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-3" style={{backgroundColor: 'rgba(255, 255, 255, 0.95)', borderTop: '1px solid rgba(0, 0, 0, 0.05)'}}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <p className="text-muted mb-0" style={{fontSize: '0.9rem'}}>© 2025 HotelManager, Tous droits réservés</p>
            <div>
              <a href="/terms" className="text-muted text-decoration-none me-3" style={{fontSize: '0.9rem'}}>Conditions d'utilisation</a>
              <a href="/privacy" className="text-muted text-decoration-none" style={{fontSize: '0.9rem'}}>Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Préchargement des images pour éviter les scintillements lors des transitions */}
      <div style={{ display: 'none' }}>
        {backgroundImages.map((img, index) => (
          <img key={index} src={img} alt="preload" />
        ))}
      </div>
    </div>
  );
}

export default LoginPage;