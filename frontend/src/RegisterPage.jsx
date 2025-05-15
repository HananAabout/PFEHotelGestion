import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { authService } from './services/authService';

function RegisterPage() {
  const [registerData, setRegisterData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    role: 'Réceptionniste'
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Images d'arrière-plan
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
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      console.log('Données envoyées:', registerData);
      const response = await authService.register(registerData);
      console.log('Réponse du serveur:', response);
      // Rediriger vers la page de connexion après inscription réussie
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur détaillée:', error);
      console.error('Erreur d\'inscription:', error.message);
      
      // Gestion des erreurs spécifiques pour le mot de passe
      if (error.errors && error.errors.mot_de_passe) {
        setErrorMessage('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&).');
      } else {
        setErrorMessage(error.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Styles pour le background changeant
  const mainStyle = {
    backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background-image 1s ease-in-out',
    position: 'relative'
  };

  // Overlay sombre pour améliorer la lisibilité du formulaire
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 d-flex align-items-center justify-content-center" style={mainStyle}>
        <div style={overlayStyle}></div>
        <div className="container position-relative z-1">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5 col-xl-4">
              <div className="card shadow" style={{ borderRadius: '10px', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                <div className="card-body p-4 p-md-5">
                  {errorMessage && (
                    <div className="alert alert-danger mb-3">
                      {errorMessage}
                    </div>
                  )}
                  
                  <h1 className="text-center mb-4 fw-bold">Créer un compte</h1>
                  <form onSubmit={handleRegister}>
                    <div className="mb-3">
                      <label htmlFor="nom" className="form-label">Nom :</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nom"
                        name="nom"
                        value={registerData.nom}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="prenom" className="form-label">Prénom :</label>
                      <input
                        type="text"
                        className="form-control"
                        id="prenom"
                        name="prenom"
                        value={registerData.prenom}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="registerEmail" className="form-label">Email :</label>
                      <input
                        type="email"
                        className="form-control"
                        id="registerEmail"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="registerPassword" className="form-label">Mot de passe :</label>
                      <input
                        type="password"
                        className="form-control"
                        id="registerPassword"
                        name="mot_de_passe"
                        value={registerData.mot_de_passe}
                        onChange={handleRegisterChange}
                        required
                      />
                      <small className="form-text text-muted">
                        Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, 
                        un chiffre et un caractère spécial (@$!%*?&).
                      </small>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="role" className="form-label">Rôle :</label>
                      <select
                        className="form-select"
                        id="role"
                        name="role"
                        value={registerData.role}
                        onChange={handleRegisterChange}
                        required
                      >
                        <option value="Réceptionniste">Réceptionniste</option>
                        <option value="Administrateur">Administrateur</option>
                      </select>
                    </div>
                    
                    <div className="d-grid gap-2 mb-3">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg"
                        style={{ backgroundColor: '#4a90e2', borderColor: '#4a90e2' }}
                      >
                        S'inscrire
                      </button>
                    </div>
                    
                    <div className="text-center">
                      <a
                        href="/"
                        className="btn btn-link text-decoration-none"
                        style={{ color: '#4a90e2' }}
                      >
                        Déjà un compte ? Se connecter
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-3 bg-white border-top">
        <div className="container">
          <p className="text-center text-muted mb-0">© 2025 HotelManager, Tous droits réservés</p>
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

export default RegisterPage;