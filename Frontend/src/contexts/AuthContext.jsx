

// src/contexts/AuthContext.jsx
import React, { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";
import HttpStatus from "http-status";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({});
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

const client = axios.create({
  baseURL: "http://localhost:8000/api/v1/users",
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const navigate = useNavigate();

  // 🧠 Restore guest state or token from localStorage
  useEffect(() => {
    const guest = localStorage.getItem("isGuest");
    const token = localStorage.getItem("token");

    if (guest === "true") {
      setIsGuest(true);
      setUserData({ name: "Guest User" });
    } else if (token) {
      setIsGuest(false);
      setUserData({ name: "Authenticated User" });
    }
  }, []);

  // ✅ REGISTER FUNCTION
  const handleRegister = async (name, username, password) => {
    try {
      const req = await client.post("/register", { name, username, password });
      if (req.status === HttpStatus.CREATED) return req.data.message;
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    }
  };

  // ✅ LOGIN FUNCTION
  const handleLogin = async (username, password) => {
    try {
      const req = await client.post("/login", { username, password });
      if (req.status === HttpStatus.OK) {
        localStorage.setItem("token", req.data.token);
        localStorage.setItem("isGuest", "false");
        setIsGuest(false);
        setUserData({ name: username });
        navigate("/home");
        return req.data.message;
      }
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  // ✅ GUEST LOGIN FUNCTION
  const loginAsGuest = () => {
    localStorage.removeItem("token");
    localStorage.setItem("isGuest", "true");
    setUserData({ name: "Guest User" });
    setIsGuest(true);
    navigate("/home");
  };

  // ✅ GET HISTORY (only for authenticated)
  const getHistoryOfOffer = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];
      const req = await client.get("/get_all_activity", { params: { token } });
      return req.data;
    } catch (err) {
      console.error("Error fetching history:", err);
      return [];
    }
  };

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isGuest");
    setUserData(null);
    setIsGuest(false);
    navigate("/");
  };

  const value = {
    userData,
    isGuest,
    handleRegister,
    handleLogin,
    loginAsGuest,
    getHistoryOfOffer,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
