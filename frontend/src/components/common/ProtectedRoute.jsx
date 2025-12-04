import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getRole } from '../../services/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && getRole() !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;