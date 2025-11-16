/*
  Styles extracted from MainTabs
  20% AI
  80% Human clean-up
*/

import { Platform, View } from "react-native";

export const tabScreenOptions = ({ route }) => ({
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    height: 60,
    borderRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 12 : 6,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    backgroundColor: "transparent",
  },
  tabBarBackground: () => (
    <View
      style={{
        flex: 1,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.2)",
      }}
    />
  ),
  tabBarActiveTintColor: "#4CAF50",
  tabBarInactiveTintColor: "#999",
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    switch (route.name) {
      case "Home":
        iconName = focused ? "home" : "home-outline";
        break;
      case "Study":
        iconName = focused ? "book" : "book-outline";
        break;
      case "Game":
        iconName = focused ? "game-controller" : "game-controller-outline";
        break;
      case "Calendar":
        iconName = focused ? "calendar" : "calendar-outline";
        break;
      default:
        iconName = "ellipse-outline";
    }

    // Imported in MainTabs, but defined here
    const { Ionicons } = require("@expo/vector-icons");
    return <Ionicons name={iconName} size={size} color={color} />;
  },
});
