// frontend/src/context/AuthContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// 🌍 Backend URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("userToken"));

  const [isLoading, setIsLoading] = useState(true);

  // Set axios base URL
  axios.defaults.baseURL = API_BASE_URL;

  // ---------------------------------------------------------
  //               Save Auth in State + LocalStorage
  // ---------------------------------------------------------
  const saveAuthData = (userData, userToken) => {
    localStorage.setItem("userToken", userToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(userToken);
    setUser(userData);

    axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
  };

  // ---------------------------------------------------------
  //               Remove Auth from Everywhere
  // ---------------------------------------------------------
  const removeAuthData = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  // ---------------------------------------------------------
  //               Fetch user from token
  // ---------------------------------------------------------
  const fetchUser = useCallback(
    async (userToken) => {
      if (!userToken) {
        removeAuthData();
        setIsLoading(false);
        return;
      }

      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        const { data } = await axios.get("/api/users/profile");
        setUser(data);
      } catch {
        removeAuthData();
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Fetch when app starts or token changes
  useEffect(() => {
    fetchUser(token);
  }, [token, fetchUser]);

  // ---------------------------------------------------------
  //                        LOGIN
  // ---------------------------------------------------------
  const login = async (phoneOrEmail, password) => {
    try {
      const { data } = await axios.post("/api/auth/login", {
        phoneOrEmail,
        password,
      });

      saveAuthData(data, data.token);
      toast.success(`Welcome back, ${data.name.split(" ")[0]}!`);

      return { user: data };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed.";
      toast.error(msg);
      throw msg;
    }
  };

  // ---------------------------------------------------------
  //                        REGISTER
  // ---------------------------------------------------------
  const register = async (name, phone, password, email) => {
    try {
      const { data } = await axios.post("/api/auth/register", {
        name,
        phone,
        password,
        email,
      });

      saveAuthData(data, data.token);
      toast.success(`Welcome, ${data.name.split(" ")[0]}!`);

      return { user: data };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed.";
      toast.error(msg);
      throw msg;
    }
  };

  // ---------------------------------------------------------
  //                   LOGOUT
  // ---------------------------------------------------------
  const logout = () => {
    removeAuthData();
    toast.info("Logged out successfully!");
  };

  // ---------------------------------------------------------
  //                   FORGOT PASSWORD
  // ---------------------------------------------------------
  const requestPasswordReset = async (phoneOrEmail) => {
    try {
      const { data } = await axios.post("/api/auth/forgot-password", {
        phoneOrEmail,
      });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send reset link.";
      throw msg;
    }
  };

  // ---------------------------------------------------------
  //                     RESET PASSWORD
  // ---------------------------------------------------------
  const resetPassword = async (tokenParam, password) => {
    try {
      const { data } = await axios.post(
        `/api/auth/reset-password/${tokenParam}`,
        { password }
      );
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reset password.";
      throw msg;
    }
  };

  // ---------------------------------------------------------
  //                   Context Value
  // ---------------------------------------------------------
  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    login,
    register,
    logout,
    fetchUser,
    requestPasswordReset,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
