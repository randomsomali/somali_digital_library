import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';

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

  // Redirect to role-based dashboard if the path is invalid for the role
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
