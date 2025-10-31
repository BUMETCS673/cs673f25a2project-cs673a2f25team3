/*
  50% AI
  50% Human
*/

import React, { useState, useContext } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { API_BASE_URL } from "@env";
// TEMP debug: verify API base URL is wired correctly
console.log("[LoginForm] API_BASE_URL:", API_BASE_URL);
import { AuthContext } from "../AuthContext";
import { styles } from "../styles/style";
import { useNavigation } from "@react-navigation/native";

export default function LoginForm() {
  const navigation = useNavigation();
  const { user, login, logout } = useContext(AuthContext);
  const [mode, setMode] = useState("login"); // login | register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async () => {
    if (!username || !password) return;

    setLoading(true);
    setErrorMsg("");
    try {
      const endpoint =
        mode === "login"
          ? `${API_BASE_URL}/users/login`
          : `${API_BASE_URL}/users/register`;
      // TEMP debug: log the endpoint being called
      console.log("[LoginForm] Auth endpoint:", endpoint);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      console.log("[LoginForm] Auth status:", res.status);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);

      if (mode === "register") {
        setMode("login"); // change to login after register
      } else {
        await login(data.user, data.token);
        // successfully login, direct to Home
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }
    } catch (err) {
      console.log(err);
      setErrorMsg(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  if (user) {
    // if logged in
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.cardH1}>{mode === "login" ? "Login" : "Register"}</Text>

        {/* Username */}
        <View style={styles.field}>
          <Text style={styles.paragraph}>Username</Text>
          <View style={styles.inputWrapper}>
            <Mail color="rgba(255,255,255,0.5)" size={20} style={styles.iconLeft} />
            <TextInput
              style={[styles.input, { paddingLeft: 36 }]}
              placeholder="Enter your username"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.field}>
          <Text style={styles.paragraph}>Password</Text>
          <View style={styles.inputWrapper}>
            <Lock color="rgba(255,255,255,0.5)" size={20} style={styles.iconLeft} />
            <TextInput
              style={[styles.input, { paddingLeft: 36, paddingRight: 36 }]}
              placeholder="Enter your password"
              placeholderTextColor="rgba(255,255,255,0.4)"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconRight}
            >
              {showPassword ? <EyeOff color="rgba(255,255,255,0.6)" size={20} /> : <Eye color="rgba(255,255,255,0.6)" size={20} />}
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 16 }} />
        ) : (
          <TouchableOpacity testID="loginButton" style={styles.loginFormButton} onPress={handleAuth}>
            <Text style={styles.loginFormButtonText}>
              {mode === "login" ? "Login" : "Register"}
            </Text>
          </TouchableOpacity>
        )}

        {errorMsg ? (
          <Text style={{ color: "#ff6b6b", marginTop: 12, textAlign: "center" }}>
            {errorMsg}
          </Text>
        ) : null}

        <TouchableOpacity onPress={() => setMode(mode === "login" ? "register" : "login")} style={{ marginTop: 12 }}>
          <Text style={{ color: "#888", textAlign: "center" }}>
            {mode === "login" ? "Switch to Register" : "Switch to Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
