// src/components/PublicRoute.jsx
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';

export const PublicRoute = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return children;
};
