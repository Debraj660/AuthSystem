import { createContext, useContext, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const register = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/register", data);
      setMessage(res.data?.message || "Registered successfully");
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err?.response?.data?.message || "Register failed";
      setMessage(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/login", data);
      setMessage(res.data?.message || "Logged in successfully");
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      setMessage(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/logout");
      setMessage(res.data?.message || "Logged out");
      return { success: true };
    } catch (err) {
      const msg = err?.response?.data?.message || "Logout failed";
      setMessage(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logoutAllDevices = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/logoutAllDevices");
      setMessage(res.data?.message || "Logged out from all devices");
      return { success: true };
    } catch (err) {
      const msg = err?.response?.data?.message || "Logout all devices failed";
      setMessage(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const res = await api.post("/refreshAccessToken");
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err?.response?.data?.message || "Token refresh failed";
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        message,
        setMessage,
        register,
        login,
        logout,
        logoutAllDevices,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);