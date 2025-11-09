/*
  80% AI
  20% Human
*/

import React from "react";
import { Platform, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Home from "../screens/Home";
import SelectStudyTime from "../screens/SelectStudyTime";
import GameMenu from "../screens/GameMenu";
import Statistics from "../screens/Statistics";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
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
              // backgroundColor: "rgba(0,0,0,0.0)", // total transparent
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
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Study" component={SelectStudyTime} />
      <Tab.Screen name="Game" component={GameMenu} />
      <Tab.Screen name="Calendar" component={Statistics} />
    </Tab.Navigator>
  );
}
