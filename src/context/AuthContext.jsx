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

  // ✅ Save user + token
  const saveAuthData = (userData, userToken) => {
    localStorage.setItem('userToken', userToken);
    setToken(userToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  };

  // ✅ Clear user + token
  const removeAuthData = () => {
    localStorage.removeItem('userToken');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // ✅ Fetch user using saved token
  const fetchUser = useCallback(async (userToken) => {
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
  }, []);

  useEffect(() => {
    fetchUser(token);
  }, [token, fetchUser]);

  // ✅ LOGIN (no change in behaviour)
  const login = async (phoneOrEmail, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { phoneOrEmail, password });

      const formatted = { user: data };

      saveAuthData(formatted.user, data.token);

      toast.success(`Welcome back, ${formatted.user.name.split(' ')[0]}!`);
      return formatted; // { user: {...} }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed.';
      toast.error(msg);
      throw msg;
    }
  };

  // ✅ REGISTER with Firebase phone OTP (extra param)
  const register = async (name, phone, password, email, firebaseIdToken) => {
    try {
      const { data } = await axios.post('/api/auth/register', {
        name,
        phone,
        password,
        email,
        firebaseIdToken,
      });

      const formatted = { user: data };

      saveAuthData(formatted.user, data.token);

      toast.success(`Welcome, ${formatted.user.name.split(' ')[0]}!`);
      return formatted;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      throw msg;
    }
  };

  // ✅ RESET PASSWORD VIA PHONE + OTP
  const resetPasswordWithPhone = async (phone, newPassword, firebaseIdToken) => {
    try {
      const { data } = await axios.post('/api/auth/reset-password-phone', {
        phone,
        password: newPassword,
        firebaseIdToken,
      });

      toast.success(data.message || 'Password reset successful');
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Password reset failed.';
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
    resetPasswordWithPhone,
    logout,
    fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
