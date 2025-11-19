/*
  25% AI
  75% Human
*/

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Play } from "lucide-react-native";
import StudyTimerInterface from "../components/StudyTimerInterface";
import { Background } from "../components/Background";
import AppIcon from "../components/icons/AppIcon";
import { iconWrapper } from "../styles/iconStyles";
import styles from "../styles/studyingStyles";   

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
            <Play color="#fff" size={18} style={styles.iconSpacing} />
            <Text style={styles.buttonText}>Start Session</Text>
          </TouchableOpacity>

        </View>

      </View>
    </Background>
  );
}
