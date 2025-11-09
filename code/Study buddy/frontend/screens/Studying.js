/*
  25% AI
  75% Human
*/

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import StudyTimerInterface from "../components/StudyTimerInterface";

export default function Studying() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Focus Mode</Text>
      <Text style={styles.subheader}>
        Start a timer to track your study session automatically.
      </Text>
      {/* Timer UI encapsulates persistence, pause/resume, and backend logging */}
      <StudyTimerInterface />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF8EE",
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#E67E22",
    marginBottom: 4,
  },
  subheader: {
    fontSize: 16,
    color: "#7A7A7A",
    textAlign: "center",
    paddingHorizontal: 24,
    marginBottom: 12,
  },
});
