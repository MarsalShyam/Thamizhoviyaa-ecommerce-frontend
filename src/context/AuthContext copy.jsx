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

  // Axios default configuration
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || ''; 

  // Function to save user data and token
  const saveAuthData = (userData, userToken) => {
    localStorage.setItem('userToken', userToken);
    setToken(userToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  };

  // Function to remove user data and token
  const removeAuthData = () => {
    localStorage.removeItem('userToken');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.info('Logged out successfully!', { position: 'bottom-right' });
  };

  // Fetch user details if token exists
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
    } catch (error) {
      // If token invalid or expired, log out
      if (userToken) {
        // toast.error('Session expired. Please log in again.', { position: 'bottom-right' });
      }
      removeAuthData();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser(token);
  }, [token, fetchUser]);

  // Authentication functions (Improved Error Handling)
  const login = async (phoneOrEmail, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { phoneOrEmail, password });
      saveAuthData(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`, { position: 'bottom-right' });
      return data; // Return data on success
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      // Throw message string instead of error object
      throw errorMessage;
    }
  };

  const register = async (name, phone, password, email) => {
    try {
      const { data } = await axios.post('/api/auth/register', { name, phone, password, email });
      saveAuthData(data.user, data.token);
      toast.success(`Registration successful! Welcome, ${data.user.name.split(' ')[0]}!`, { position: 'bottom-right' });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed.';
      toast.error(errorMessage);
      throw errorMessage;
    }
  };

  const logout = () => {
    removeAuthData();
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false, // Ensure isAdmin check included
    login,
    register,
    logout,
    fetchUser, // To manually refresh user data
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
