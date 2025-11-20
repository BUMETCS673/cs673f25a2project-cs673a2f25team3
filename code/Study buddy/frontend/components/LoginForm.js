/*
  40% AI
  60% Human
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
import { loginStyles } from "../styles/loginStyle";
import { colors } from "../styles/base";

const isPasswordSecure = (pw) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,}$/.test(pw);

export default function LoginForm() {
  const navigation = useNavigation();
  const { user, login, logout } = useContext(AuthContext);
  const [mode, setMode] = useState("login"); // login | register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Util: Very basic client-side secure password regex validation
  // 12+ chars, at least 1 number, 1 lowercase, 1 uppercase, 1 special char

  const handleAuth = async () => {
    if (!username) {
      setErrorMsg(
        "Must contain username"
      );
      return;
    };

    if (!password) {
      setErrorMsg(
        "Must contain password"
      );
      return;
    }

    if (mode === "register" && !isPasswordSecure(password)) {
      setErrorMsg(
        "Password must be at least 12 characters: including a number, an uppercase, a lowercase, and a special character."
      );
      return;
    }

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
        navigation.replace("Home")
      }
    } catch (err) {
      if (err?.message == "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username") {
        setErrorMsg("Username taken");
        return;
      }
      console.log(err);
      setErrorMsg(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setErrorMsg("");
  }

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
            <Mail color={colors.text} size={20} style={styles.iconLeft} />
            <TextInput
              style={[styles.input, { paddingLeft: 36 }]}
              placeholder="Username"
              placeholderTextColor={colors.text}
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
            <Lock color={colors.text} size={20} style={styles.iconLeft} />
            <TextInput
              style={[styles.input, { paddingLeft: 36, paddingRight: 36 }]}
              placeholder={"Password"}
              placeholderTextColor={colors.text}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconRight}
            >
              {showPassword ? <EyeOff color={colors.text} size={20} /> : <Eye color={colors.text} size={20} />}
            </TouchableOpacity>
          </View>
          {/* Show password advice/info during register */}
          {mode === "register" && (
            <Text style={loginStyles.hint}>
              Use at least 12 characters: including a number, an uppercase, a lowercase, and a special character.
            </Text>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.text} style={{ marginTop: 16 }} />
        ) : (
          <TouchableOpacity testID="loginButton" style={styles.loginFormButton} onPress={handleAuth}>
            <Text style={styles.loginFormButtonText}>
              {mode === "login" ? "Login" : "Register"}
            </Text>
          </TouchableOpacity>
        )}

        {errorMsg ? (
          <Text style={loginStyles.error}>
            {errorMsg}
          </Text>
        ) : null}

        <TouchableOpacity onPress={switchMode} style={{ marginTop: 12 }}>
          <Text style={{ color: colors.text, textAlign: "center" }}>
            {mode === "login" ? "Switch to Register" : "Switch to Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export const exportForTest = {
  isPasswordSecure
};