/*
  80% AI generate
  20% Human
*/

import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // JWT payload
  const parseJwt = (jwt) => {
    try {
      const base64Payload = jwt.split('.')[1];
      const payload = JSON.parse(atob(base64Payload));
      return payload;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");

        if (storedUser && storedToken) {
          const payload = parseJwt(storedToken);
          const now = Math.floor(Date.now() / 1000);

          if (payload && payload.exp && payload.exp > now) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);

            // set timeout timer
            const timeout = (payload.exp - now) * 1000;
            setTimeout(() => logout(), timeout);
          } else {
            await logout(); // token expired
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

  const login = async (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    await AsyncStorage.setItem("token", tokenData);

    const payload = parseJwt(tokenData);
    const now = Math.floor(Date.now() / 1000);
    if (payload && payload.exp && payload.exp > now) {
      const timeout = (payload.exp - now) * 1000;
      setTimeout(() => logout(), timeout);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
