import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";

export default function LoginForm() {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log("Login attempt:", { email, password });
    navigation.replace("Home"); 
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        {/* Email */}
        <View style={styles.field}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Mail color="rgba(255,255,255,0.5)" size={20} style={styles.iconLeft} />
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="rgba(255,255,255,0.4)"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { paddingLeft: 36 }]}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Lock color="rgba(255,255,255,0.5)" size={20} style={styles.iconLeft} />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="rgba(255,255,255,0.4)"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { paddingLeft: 36, paddingRight: 36 }]}
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

        {/* Forgot Password */}
        <TouchableOpacity onPress={() => console.log("Forgot password clicked")}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign In</Text>
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
    width: "100%",
    padding: 24,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
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
  forgotPassword: {
    textAlign: "right",
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20,
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
