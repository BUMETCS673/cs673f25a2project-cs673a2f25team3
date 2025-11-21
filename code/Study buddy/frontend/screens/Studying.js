/*
  25% AI
  75% Human
*/

import { View, Text } from "react-native";
import StudyTimerInterface from "../components/StudyTimerInterface";
import { Background } from "../components/Background";
import AppIcon from "../components/icons/AppIcon";
import { iconWrapper } from "../styles/iconStyles";
import {studyingStyles} from "../styles/studyingStyles";

export default function Studying() {
  return (
    <Background align={false}>
      <View style={studyingStyles.container}>
        <View style={studyingStyles.header}>
          <View style={iconWrapper}>
            <AppIcon name="clock" size={44} />
          </View>

          <Text style={studyingStyles.headerTitle}>Focus Mode</Text>
          <Text style={studyingStyles.motto}>
            Consistency turns effort into progress
          </Text>
        </View>

        <View style={studyingStyles.timerWrapper}>
          <StudyTimerInterface />
        </View>
      </View>
    </Background>
  );
}
