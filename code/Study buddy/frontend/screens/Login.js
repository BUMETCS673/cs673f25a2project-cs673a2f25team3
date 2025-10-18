import React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import LoginForm from "../components/LoginForm"; 

export default function Login() {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1673526759317-be71a1243e3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwcHVycGxlJTIwYmx1ZXxlbnwxfHx8fDE3NjA2NzEyNTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
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
