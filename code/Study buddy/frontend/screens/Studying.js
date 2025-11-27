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
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function Studying() {
  const insets = useSafeAreaInsets();
  const { setGameTimeRemaining } = useContext(AuthContext);
  
  return (
    <Background>
      <SafeAreaView
        style={[
          studyingStyles.container,
          {
            backgroundColor: "transparent", // let the background show through the safe area
          },
        ]}
        edges={["top", "bottom"]}
      >
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={[
            studyingStyles.scrollContent,
            {
              paddingBottom: insets.bottom + 16,
            },
          ]}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
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
            <StudyTimerInterface
              onSessionComplete={(minutes) => {
                if (minutes === 60) {
                  setGameTimeRemaining(10 * 60); // unlock 10 min
                } else if (minutes === 25) {
                  setGameTimeRemaining(5 * 60); // unlock 5 min
                }
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}
