/*
  30% AI
  70% Human
*/

import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";

import { AuthProvider, AuthContext } from "./AuthContext";
import MainTabs from "./components/MainTabs";

import Login from "./screens/Login";
import Settings from "./screens/Settings";
import Studying from "./screens/Studying";
import Game1 from "./screens/games/game1";
import Game2 from "./screens/games/game2";
import Game3 from "./screens/games/game3";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Login" component={MainTabs} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Studying" component={Studying} />
          <Stack.Screen name="Game1" component={Game1} options={{ headerShown: true, headerTitle: "Game 1" }} />
          <Stack.Screen name="Game2" component={Game2} options={{ headerShown: true, headerTitle: "Game 2" }} />
          <Stack.Screen name="Game3" component={Game3} options={{ headerShown: true, headerTitle: "Game 3" }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
