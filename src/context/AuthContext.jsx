// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('userToken'));
  const [isLoading, setIsLoading] = useState(true);

  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || '';

  // Save user + token
  const saveAuthData = (userData, userToken) => {
    localStorage.setItem('userToken', userToken);
    setToken(userToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  };

  // Clear user + token
  const removeAuthData = () => {
    localStorage.removeItem('userToken');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Fetch user using saved token
  const fetchUser = useCallback(
    async (userToken) => {
      if (!userToken) {
        removeAuthData();
        setIsLoading(false);
        return;
      }

      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        const { data } = await axios.get('/api/users/profile');
        setUser(data);
      } catch (err) {
        removeAuthData();
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchUser(token);
  }, [token, fetchUser]);

  // LOGIN
  const login = async (phoneOrEmail, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { phoneOrEmail, password });

      const formatted = { user: data };
      saveAuthData(formatted.user, data.token);

      toast.success(`Welcome back, ${formatted.user.name.split(' ')[0]}!`);
      return formatted; // { user: {...} }
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email/phone or password.';
      toast.error(msg);
      throw msg;
    }
  };

  // REGISTER – now only sends email verification, no auto-login
  const register = async (name, phone, password, email) => {
    try {
      const { data } = await axios.post('/api/auth/register', {
        name,
        phone,
        password,
        email,
      });

      toast.success(
        data.message || 'Registration successful. Please check your email to verify your account.'
      );
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'User already exists with this email or phone';
      toast.error(msg);
      throw msg;
    }
  };

  // VERIFY EMAIL
  const verifyEmail = async (tokenParam) => {
    try {
      const { data } = await axios.post('/api/auth/verify-email', { token: tokenParam });
      toast.success(data.message || 'Email verified successfully.');
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Email verification failed.';
      toast.error(msg);
      throw msg;
    }
  };

  // REQUEST PASSWORD RESET
  const requestPasswordReset = async (email) => {
    try {
      const { data } = await axios.post('/api/auth/forgot-password', { email });
      toast.info(
        data.message ||
          'If an account with that email exists, a password reset link has been sent.'
      );
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send reset link.';
      toast.error(msg);
      throw msg;
    }
  };

  // RESET PASSWORD
  const resetPassword = async (tokenParam, newPassword) => {
    try {
      const { data } = await axios.post(`/api/auth/reset-password/${tokenParam}`, {
        password: newPassword,
      });
      toast.success(data.message || 'Password reset successful.');
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to reset password.';
      toast.error(msg);
      throw msg;
    }
  };

  const logout = () => {
    removeAuthData();
    toast.info('Logged out successfully!');
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    login,
    register,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    logout,
    fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
