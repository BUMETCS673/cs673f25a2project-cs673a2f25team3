import React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import LoginForm from "../components/LoginForm"; 

export default function Login() {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80",
      }}
      style={styles.background}
      blurRadius={4} 
    >
      <View style={styles.overlay}>
        <LoginForm />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)", 
    paddingHorizontal: 20,
  },
});
