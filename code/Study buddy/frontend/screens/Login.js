import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../styles/style"; 
import { Background } from "../components/Background";

import { API_BASE_URL } from "@env";
console.log("Using API:", API_BASE_URL);

export default function Login({ navigation }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem("user");
      if (user) setLoggedInUser(JSON.parse(user));
    };
    checkUser();
  }, []);

  const handleAuth = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }
    setLoading(true);
    try {
      const endpoint =
        mode === "login" ? `${API_BASE_URL}/login` : `${API_BASE_URL}/register`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      if (mode === "register") {
        Alert.alert("✅ Success", "Registration successful! Please log in.", [
          { text: "OK", onPress: () => setMode("login") },
        ]);
      } else {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        setLoggedInUser(data.user);
        Alert.alert("Success", "Login successful!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home", { user: data.user }),
          },
        ]);
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setLoggedInUser(null);
    setMode("login");
    setUsername("");
    setPassword("");
    Alert.alert("Logged out", "You have been logged out.");
  };

  if (loggedInUser) {
    return (
      <Background>
        <View style={[styles.card, { gap: 15, alignItems: "center" }]}>
          <Text style={[styles.cardH1, { fontSize: 24 }]}>
            Welcome, {loggedInUser.username}
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: "#ff758c", paddingVertical: 14, width: 200 },
            ]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Background>
    );
  }

  return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ width: "100%", alignItems: "center" }}
      >
        <LinearGradient
          colors={["#ff758c", "#ff7eb3"]}
          start={[0, 0]}
          end={[1, 1]}
          style={{
            width: "90%",
            borderRadius: 20,
            padding: 24,
            marginTop: 60,
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 10,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: "#fff",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            {mode === "login" ? "Login" : "Register"}
          </Text>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: "#fff", marginBottom: 6 }}>Username</Text>
            <View style={{ position: "relative" }}>
              <Mail
                color="rgba(255,255,255,0.7)"
                size={20}
                style={{ position: "absolute", left: 10, top: 12 }}
              />
              <TextInput
                style={{
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  paddingLeft: 36,
                  paddingRight: 12,
                }}
                placeholder="Enter username"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: "#fff", marginBottom: 6 }}>Password</Text>
            <View style={{ position: "relative" }}>
              <Lock
                color="rgba(255,255,255,0.7)"
                size={20}
                style={{ position: "absolute", left: 10, top: 12 }}
              />
              <TextInput
                style={{
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  paddingLeft: 36,
                  paddingRight: 36,
                }}
                placeholder="Enter password"
                placeholderTextColor="rgba(255,255,255,0.5)"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 10, top: 12 }}
              >
                {showPassword ? (
                  <EyeOff color="rgba(255,255,255,0.7)" size={20} />
                ) : (
                  <Eye color="rgba(255,255,255,0.7)" size={20} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#fff" style={{ marginTop: 10 }} />
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                paddingVertical: 14,
                alignItems: "center",
                marginTop: 10,
              }}
              onPress={handleAuth}
            >
              <Text style={{ color: "#ff758c", fontWeight: "700", fontSize: 16 }}>
                {mode === "login" ? "Login" : "Register"}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => setMode(mode === "login" ? "register" : "login")}
          >
            <Text
              style={{
                color: "#fff",
                marginTop: 16,
                textAlign: "center",
                textDecorationLine: "underline",
              }}
            >
              {mode === "login"
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAvoidingView>
    </Background>
  );
}
