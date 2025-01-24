// src/components/AuthRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';

export const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  // If user is already authenticated and tries to access login page
  if (user && location.pathname === '/login') {
    // Redirect to their respective dashboard based on role
    const defaultRoute = user.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard';
    // Use the intended destination from location state, or fall back to default route
    const destination = location.state?.from?.pathname || defaultRoute;
    return <Navigate to={destination} replace />;
  }

  return children;
};
