import { useState, useEffect, createContext, useContext } from "react";

import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  async function checkAuth() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await api.get("/api/auth/me");
        setUser(response.data.user);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
    }
    setAuthLoading(false);
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function login(email, password) {
    const response = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    return response.data;
  }

  async function register(name, email, password) {
    const response = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    return response.data;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  const value = {
    user,
    authLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
