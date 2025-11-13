/*
  80% AI
  20% Human
*/

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../screens/Home";
import Studying from "../screens/Studying";
import GameMenu from "../screens/GameMenu";
import Statistics from "../screens/Statistics";

import { tabScreenOptions } from "../styles/tabsStyle"; 

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={tabScreenOptions}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Study" component={Studying} />
      <Tab.Screen name="Game" component={GameMenu} />
      <Tab.Screen name="Calendar" component={Statistics} />
    </Tab.Navigator>
  );
}
