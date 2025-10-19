import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { API_BASE_URL } from "@env";

export default function LoginForm({ navigation }) {
  const [mode, setMode] = useState("login"); // login | register
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={[styles.title, { fontSize: 24 }]}>
            Welcome, {loggedInUser.username}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#ff758c", paddingVertical: 14, width: 200 }]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{mode === "login" ? "Login" : "Register"}</Text>

        {/* Username */}
        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
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
          <Text style={styles.label}>Password</Text>
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
              {showPassword ? (
                <EyeOff color="rgba(255,255,255,0.6)" size={20} />
              ) : (
                <Eye color="rgba(255,255,255,0.6)" size={20} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 16 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <Text style={styles.buttonText}>{mode === "login" ? "Login" : "Register"}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setMode(mode === "login" ? "register" : "login")} style={{ marginTop: 14 }}>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
            {mode === "login"
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  card: {
    width: "90%",
    padding: 24,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    marginTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    color: "rgba(255,255,255,0.9)",
    marginBottom: 6,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
  },
  iconLeft: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  iconRight: {
    position: "absolute",
    right: 10,
    zIndex: 1,
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
