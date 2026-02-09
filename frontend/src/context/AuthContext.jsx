import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const API = `${BACKEND_URL}/api`;

// Set token from localStorage immediately so any early axios calls have it
const storedToken = localStorage.getItem("token");
if (storedToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(storedToken);
  const [loading, setLoading] = useState(true);
  const logoutRef = useRef(null);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  }, []);

  // Keep ref in sync so interceptor always calls latest logout
  logoutRef.current = logout;

  // Axios response interceptor — auto-logout on 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 401 &&
          !error.config?.url?.includes("/login") &&
          !error.config?.url?.includes("/register")
        ) {
          logoutRef.current();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Fetch user profile on mount / token change
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get(`${API}/users/profile`);
          if (response.data.success) {
            setUser(response.data.data);
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token, logout]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API}/users/login`, { email, password });
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data.data;
        localStorage.setItem("token", newToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        setToken(newToken);
        setUser(userData);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API}/users/register`, userData);
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data.data;
        localStorage.setItem("token", newToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        setToken(newToken);
        setUser(newUser);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // Helper to re-fetch the current user (e.g. after profile update)
  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API}/users/profile`);
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch {
      // silently fail — interceptor handles 401
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
