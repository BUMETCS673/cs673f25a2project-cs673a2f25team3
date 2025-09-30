import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import SelectStudyTime from './screens/SelectStudyTime';
import GameMenu from './screens/GameMenu';
import Statistics from './screens/Statistics';
import Settings from './screens/Settings';
import Login from './screens/Login';
import Studying from './screens/Studying';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="GameMenu" component={GameMenu} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SelectStudyTime" component={SelectStudyTime} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Statistics" component={Statistics} />
        <Stack.Screen name="Studying" component={Studying} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
