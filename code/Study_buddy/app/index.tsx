import React, { useState } from "react";
import { Dimensions, ImageBackground, StyleSheet, View } from "react-native";
import HomePage from "./components/HomePage";
import LoginForm from "./components/LoginForm";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <HomePage />;
  }

  return (
    <View style={styles.container}>

      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1673526759317-be71a1243e3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwcHVycGxlJTIwYmx1ZXxlbnwxfHx8fDE3NjA2NzEyNTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
        }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />

        <View style={[styles.circle, styles.circleBlue]} />
        <View style={[styles.circle, styles.circlePurple]} />

        <View style={styles.formContainer}>
          <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
        </View>
      </ImageBackground>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(128, 0, 128, 0.3)", 
  },
  circle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.4,
  },
  circleBlue: {
    top: height * 0.25,
    left: width * 0.25,
    backgroundColor: "rgba(59, 130, 246, 0.3)", 
  },
  circlePurple: {
    bottom: height * 0.25,
    right: width * 0.25,
    backgroundColor: "rgba(147, 51, 234, 0.3)", 
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    zIndex: 10,
  },
});
