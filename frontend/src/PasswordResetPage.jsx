// PasswordResetPage.jsx
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function PasswordResetPage() {
  // États pour les champs de formulaire
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  
  // État pour le contrôle des différentes étapes
  const [resetStage, setResetStage] = useState('request'); // 'request' ou 'reset'
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [formError, setFormError] = useState('');

  // Images d'arrière-plan (remplacez par vos propres URLs d'images)
  const backgroundImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  ];

  // Effet pour changer l'image d'arrière-plan toutes les 5 secondes
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBgIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    // Nettoyage de l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, []);

  // Gestion de la demande initiale de réinitialisation
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setFormError('Veuillez entrer votre adresse email');
      return;
    }
    
    // Simuler l'envoi d'un email (dans une application réelle, vous appelleriez votre API)
    console.log('Demande de réinitialisation pour:', email);
    
    // Dans une application réelle, vous resteriez sur cette page avec un message de confirmation
    // Pour cette démo, nous passons directement à l'étape suivante comme si l'utilisateur avait cliqué sur le lien d'email
    alert(`Un email de réinitialisation a été envoyé à ${email}. Pour cette démo, nous passons directement à l'étape suivante.`);
    setResetStage('reset');
    setFormError('');
  };

  // Gestion de la définition du nouveau mot de passe
  const handleResetSubmit = (e) => {
    e.preventDefault();
    
    // Validation simple
    if (!resetCode) {
      setFormError('Veuillez entrer le code de réinitialisation');
      return;
    }
    
    if (!newPassword) {
      setFormError('Veuillez entrer un nouveau mot de passe');
      return;
    }
    
    if (newPassword.length < 8) {
      setFormError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas');
      return;
    }

    // Simuler la réinitialisation du mot de passe (dans une application réelle, vous appelleriez votre API)
    console.log('Réinitialisation du mot de passe avec:', { resetCode, newPassword });
    
    // Afficher un message de succès
    alert('Votre mot de passe a été réinitialisé avec succès! Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.');
    
    // Redirection vers la page de connexion (simulée pour cette démo)
    window.location.href = '/login';
  };

  // Retour à la première étape
  const handleBackToRequest = () => {
    setResetStage('request');
    setFormError('');
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
      {/* Header */}
      <header className="py-3 bg-white shadow-sm">
        
      </header>
      
      {/* Main Content with changing background */}
      <main className="flex-grow-1 d-flex align-items-center justify-content-center" style={mainStyle}>
        <div style={overlayStyle}></div>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5 col-xl-4">
              <div className="card shadow" style={{ borderRadius: '10px', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                <div className="card-body p-4 p-md-5">
                  {resetStage === 'request' ? (
                    // Formulaire de demande de réinitialisation
                    <>
                      <h1 className="text-center mb-4 fw-bold">Réinitialisation du mot de passe</h1>
                      <p className="text-center mb-4">
                        Entrez votre adresse email ci-dessous. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
                      </p>
                      
                      {formError && (
                        <div className="alert alert-danger" role="alert">
                          {formError}
                        </div>
                      )}
                      
                      <form onSubmit={handleRequestSubmit}>
                        <div className="mb-4">
                          <label htmlFor="email" className="form-label">Email :</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="d-grid gap-2 mb-3">
                          <button 
                            type="submit" 
                            className="btn btn-primary btn-lg"
                            style={{ backgroundColor: '#4a90e2', borderColor: '#4a90e2' }}
                          >
                            Envoyer le lien
                          </button>
                        </div>
                        
                        <div className="text-center">
                          <a 
                            href="/login" 
                            className="text-decoration-none" 
                            style={{ color: '#4a90e2' }}
                          >
                            Retour à la connexion
                          </a>
                        </div>
                      </form>
                    </>
                  ) : (
                    // Formulaire de définition du nouveau mot de passe
                    <>
                      <h1 className="text-center mb-4 fw-bold">Nouveau mot de passe</h1>
                      <p className="text-center mb-4">
                        Veuillez entrer le code reçu par email ainsi que votre nouveau mot de passe.
                      </p>
                      
                      {formError && (
                        <div className="alert alert-danger" role="alert">
                          {formError}
                        </div>
                      )}
                      
                      <form onSubmit={handleResetSubmit}>
                        <div className="mb-3">
                          <label htmlFor="resetCode" className="form-label">Code de réinitialisation :</label>
                          <input
                            type="text"
                            className="form-control"
                            id="resetCode"
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="newPassword" className="form-label">Nouveau mot de passe :</label>
                          <input
                            type="password"
                            className="form-control"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength="8"
                          />
                          <small className="form-text text-muted">
                            Le mot de passe doit contenir au moins 8 caractères.
                          </small>
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="confirmPassword" className="form-label">Confirmez le mot de passe :</label>
                          <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="d-grid gap-2 mb-3">
                          <button 
                            type="submit" 
                            className="btn btn-primary btn-lg"
                            style={{ backgroundColor: '#4a90e2', borderColor: '#4a90e2' }}
                          >
                            Réinitialiser le mot de passe
                          </button>
                        </div>
                        
                        <div className="text-center">
                          <button 
                            type="button" 
                            className="btn btn-link text-decoration-none"
                            style={{ color: '#4a90e2' }}
                            onClick={handleBackToRequest}
                          >
                            Retour à l'étape précédente
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
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

export default PasswordResetPage;