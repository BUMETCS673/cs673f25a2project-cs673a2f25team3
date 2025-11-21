/*
  80% AI generate
  20% Human
*/

import React, { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();
import { API_BASE_URL } from "@env";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [studyData, setStudyData] = useState(null); 
  const [loading, setLoading] = useState(true);

  const parseJwt = (jwt) => {
    try {
      const base64Payload = jwt.split('.')[1];
      const payload = JSON.parse(atob(base64Payload));
      return payload;
    } catch (e) {
      return null;
    }
  };

  // Helper function to check if token is valid and not expired
  const isTokenValid = (tokenString) => {
    const payload = parseJwt(tokenString);
    if (!payload || !payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setStudyData(null); 
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
  };

  // Helper function to set auto-logout timeout based on token expiration
  const setupTokenExpirationTimeout = useCallback((tokenString) => {
    const payload = parseJwt(tokenString);
    if (payload && payload.exp){
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp > now) {
        const timeout = (payload.exp - now) * 1000;
        setTimeout(() => logout(), timeout);
        return;
      }
    }

    logout();
  }, []);

  // -------------------------
  // get Study Buddy data
  // -------------------------
  const fetchStudyBuddyData = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/buddy/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const json = await res.json();
      setStudyData(json);
    } catch (err) {
      console.log("Failed to fetch study buddy data:", err);
    }
  }, [token]);

  // -------------------------
  // after APP start load session
  // -------------------------
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");

        if (storedUser && storedToken) {
          if (isTokenValid(storedToken)) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);

            // refresh study buddy data
            await fetchStudyBuddyData();

            setupTokenExpirationTimeout(storedToken);
          } else {
            await logout();
          }
        }
      } catch (err) {
        console.log("Failed to load auth", err);
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  // -------------------------
  // Login
  // -------------------------
  const login = async (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    await AsyncStorage.setItem("token", tokenData);

    // After login refresh study buddy data
    await fetchStudyBuddyData();

    setupTokenExpirationTimeout(tokenData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        studyData,
        fetchStudyBuddyData,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
