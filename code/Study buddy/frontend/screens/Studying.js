/*
  25% AI
  75% Human
*/

import { View, Text, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import StudyTimerInterface from "../components/StudyTimerInterface";
import { Background } from "../components/Background";
import AppIcon from "../components/icons/AppIcon";
import { iconWrapper } from "../styles/iconStyles";
import {studyingStyles} from "../styles/studyingStyles";

export default function Studying() {
  const insets = useSafeAreaInsets();

  return (
    <Background>
      <SafeAreaView
        style={[studyingStyles.container, { paddingTop: insets.top }]}
        edges={["top", "bottom"]}
      >
        <ScrollView
          contentContainerStyle={[
            studyingStyles.scrollContent,
            { paddingBottom: insets.bottom + 16 },
          ]}
          showsVerticalScrollIndicator={false}
        >
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
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}
