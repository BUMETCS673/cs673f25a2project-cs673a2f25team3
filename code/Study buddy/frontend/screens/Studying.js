/*
  25% AI
  75% Human
*/

import { View, Text } from "react-native";
import StudyTimerInterface from "../components/StudyTimerInterface";
import { Background } from "../components/Background";
import AppIcon from "../components/icons/AppIcon";
import { iconWrapper } from "../styles/iconStyles";
import styles from "../styles/studyingStyles";   

export default function Studying() {
  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={iconWrapper}>
            <AppIcon name="clock" size={44} />
          </View>

          <Text style={styles.headerTitle}>Focus Mode</Text>
          <Text style={styles.motto}>
            Consistency turns effort into progress
          </Text>
        </View>

        <View style={styles.timerWrapper}>
          <StudyTimerInterface />
        </View>
      </View>
    </Background>
  );
}
