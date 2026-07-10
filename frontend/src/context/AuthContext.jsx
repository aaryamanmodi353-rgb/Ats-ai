import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('resumeiq_token') || null);
  const [loading, setLoading] = useState(true);

  // Configure axios authorization header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('resumeiq_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('resumeiq_token');
    }
  }, [token]);

  // Load current user on initial mount if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('/api/auth/me');
        if (response.data?.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Failed to verify stored token:', error);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data?.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        toast.success(`Welcome back, ${response.data.user.fullName}!`);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to sign in. Please check your credentials.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const signup = async (fullName, email, password) => {
    try {
      const response = await axios.post('/api/auth/signup', { fullName, email, password });
      if (response.data?.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        toast.success(`Welcome to ResumeIQ, ${response.data.user.fullName}!`);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create account.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    toast.info('You have been signed out.');
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
