/*
  25% AI
  75% Human
*/

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Clock, Play } from "lucide-react-native";
import StudyTimerInterface from "../components/StudyTimerInterface";
import { Background } from "../components/Background";
import AppIcon from '../components/icons/AppIcon';
import { iconWrapper } from '../styles/iconStyles';
import { styles } from "../styles/style";

export default function Studying() {
  return (
    <Background>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>

          <View style={iconWrapper}>
            <AppIcon name="clock" size={44} />
          </View>

          <Text style={styles.headerTitle}>Focus Mode</Text>
          <Text style={styles.motto}>
            Consistency turns effort into progress
          </Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Start a timer to track your study session automatically.
          </Text>

          {/* Timer UI */}
          <View style={styles.timerWrapper}>
            <StudyTimerInterface />
          </View>

          {/* Start Button */}
          <TouchableOpacity style={styles.button}>
            <Play color="#fff" size={18} style={{ marginRight: 6 }} />
            <Text style={styles.buttonText}>Start Session</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E67E22",
  },
  motto: {
    fontSize: 13,
    color: "#A0601A",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: "#FFF8F0",
    borderWidth: 2,
    borderColor: "#F5C16C",
    borderRadius: 12,
    padding: 18,
  },
  infoText: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  timerWrapper: {
    alignItems: "center",
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#E67E22",
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
