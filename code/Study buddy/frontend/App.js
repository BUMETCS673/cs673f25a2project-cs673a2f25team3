import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import SelectStudyTime from './screens/SelectStudyTime';
import GameMenu from './screens/GameMenu';
import Statistics from './screens/Statistics';
import Settings from './screens/Settings';
import Login from './screens/Login';
import Studying from './screens/Studying';

/*
  60% framework
  40% manual
*/

const Stack = createNativeStackNavigator();

// name is the routing name that needs to go in buttons to direct to the right page
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
