import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';

// Add check for login path and handle redirects
export const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  // Redirect to login if not authenticated
  if (!admin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based path protection
  const path = location.pathname;
  const isAdminRoute = path.startsWith('/admin');
  const isStaffRoute = path.startsWith('/staff');

  if (admin.role === 'admin' && isStaffRoute) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (admin.role === 'staff' && isAdminRoute) {
    return <Navigate to="/staff/dashboard" replace />;
  }

  return children;
};