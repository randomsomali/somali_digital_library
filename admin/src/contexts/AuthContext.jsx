// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import  { login as apiLogin, logout as apiLogout, getCurrentAdmin } from '../services/api';
import Loader from '../components/Loader';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentAdmin();
        setAdmin(response.admin);
        setMessage(response.message);
      } catch (error) {
        setAdmin(null);
        setError(error.message);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkAuth();
  }, []);

  // Clear error and message after 5 seconds
  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError(null);
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, message]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiLogin(email, password);
      setAdmin(response.admin);
      setMessage(response.message);
      return response.admin;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const message = await apiLogout();
      setAdmin(null);
      setMessage(message);
      window.location.href = '/login';
    } catch (error) {
      setError(error.message);
      // Force logout even if API call fails
      setAdmin(null);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  const updateAdminInContext = (updatedAdminData) => {
    setAdmin(prevAdmin => ({
      ...prevAdmin,
      ...updatedAdminData
    }));
  };

  if (!initialized) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={{ 
      admin,
      loading,
      error,
      message,
      login,
      logout,
      updateAdminInContext,
      isAuthenticated: !!admin,
      isAdmin: admin?.role === 'admin',
      isStaff: admin?.role === 'staff',
      clearError: () => setError(null),
      clearMessage: () => setMessage(null)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);