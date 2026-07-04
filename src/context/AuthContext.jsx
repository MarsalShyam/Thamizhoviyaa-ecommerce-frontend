// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { isLoaded: clerkLoaded, isSignedIn, getToken, signOut } = useClerkAuth();
  const { user: clerkUser } = useClerkUser();
  const [user, setUser] = useState(null);
  const [isMongoLoading, setIsMongoLoading] = useState(true);

  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || '';

  // 1. Axios Request Interceptor to dynamically inject Clerk Token
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      async (config) => {
        if (isSignedIn) {
          try {
            const token = await getToken();
            if (token) {
              config.headers['Authorization'] = `Bearer ${token}`;
            }
          } catch (err) {
            console.error('Error fetching Clerk token for axios:', err);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [isSignedIn, getToken]);

  // 2. Fetch / Sync User Profile from MongoDB
  const fetchUser = useCallback(async () => {
    if (!isSignedIn) {
      setUser(null);
      setIsMongoLoading(false);
      return;
    }
    try {
      setIsMongoLoading(true);
      const { data } = await axios.get('/api/users/profile');
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch MongoDB user profile:', err);
      setUser(null);
    } finally {
      setIsMongoLoading(false);
    }
  }, [isSignedIn]);

  // 3. Trigger profile fetch when Clerk state is initialized and signed in
  useEffect(() => {
    if (clerkLoaded) {
      fetchUser();
    }
  }, [clerkLoaded, isSignedIn, fetchUser]);

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      toast.info('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed.');
    }
  };

  const value = {
    user,
    clerkUser,
    isLoading: !clerkLoaded || isMongoLoading,
    isAuthenticated: isSignedIn && !!user,
    isAdmin: user?.isAdmin || false,
    logout,
    fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
