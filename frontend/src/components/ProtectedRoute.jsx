import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

function ProtectedRoute({ children, requiredRole }) {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Comparaison insensible à la casse pour le rôle
  if (requiredRole && user.role && user.role.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;