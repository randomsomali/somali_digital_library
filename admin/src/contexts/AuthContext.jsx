// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api, { login as apiLogin, logout as apiLogout } from '../services/api';
import Loader from '../components/Loader';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/admins/me'); // Adjusted to fetch admin data
        const adminData = response.data;
        setAdmin(adminData);
        console.log(adminData)

        // Automatically navigate to the correct dashboard
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '/login') {
          const roleBasedPath = adminData.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard';
          window.location.replace(roleBasedPath);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setAdmin(null); // Unauthenticated
        } else {
          console.error('Authentication check failed:', error);
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await apiLogin(username, password);
      setAdmin(response.admin); // Adjusted to set admin data
      return response.admin;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setAdmin(null);
      window.location.href = '/login'; // Force redirect to login
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
      login, 
      logout, 
      loading,
      updateAdminInContext 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);