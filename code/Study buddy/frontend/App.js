/* 
  50% AI
  50% Human
*/

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, AuthContext } from "./AuthContext";
import { useContext } from "react";

import Home from "./screens/Home";
import SelectStudyTime from "./screens/SelectStudyTime";
import GameMenu from "./screens/GameMenu";
import Statistics from "./screens/Statistics";
import Settings from "./screens/Settings";
import Login from "./screens/Login";
import Studying from "./screens/Studying";
import Game1 from "./screens/games/game1";
import Game2 from "./screens/games/game2";
import Game3 from "./screens/games/game3";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // splash screen if needed
  // name is the routing name that needs to go in buttons to direct to the right page
  return (
    <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
    {/* <Stack.Navigator initialRouteName={"GameMenu"}> */}
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="GameMenu" component={GameMenu} />
      <Stack.Screen name="SelectStudyTime" component={SelectStudyTime} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Statistics" component={Statistics} />
      <Stack.Screen name="Studying" component={Studying} />
      <Stack.Screen name="Game1" component={Game1}
        options={{
          headerTitleStyle: {
            userSelect: "none",
            pointerEvents: "none",
          },
      }}/>
      <Stack.Screen name="Game2" component={Game2}
        options={{
          headerTitleStyle: {
            userSelect: "none",
            pointerEvents: "none",
          },
      }}/>
      <Stack.Screen name="Game3" component={Game3}
        options={{
          headerTitleStyle: {
            userSelect: "none",
            pointerEvents: "none",
          },
      }}/>
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
