
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import API from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check whether a user already has a valid session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await API.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    const response = await API.post('/auth/login', {
      email,
      password,
    });

    setUser(response.data.user);

    return response.data;
  };

  // Register
  const register = async (name, email, password) => {
    const response = await API.post('/auth/register', {
      name,
      email,
      password,
    });

    return response.data;
  };

  // Logout
  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
