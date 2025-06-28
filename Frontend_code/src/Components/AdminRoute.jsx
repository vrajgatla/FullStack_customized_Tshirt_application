import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    // Logged in but not admin, redirect to home page
    return <Navigate to="/" replace />;
  }

  // Authorized, render children
  return children;
}

export default AdminRoute; 