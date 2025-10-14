import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import SelectStudyTime from './screens/SelectStudyTime';
import GameMenu from './screens/GameMenu';
import Statistics from './screens/Statistics';
import Settings from './screens/Settings';
import Login from './screens/Login';
import Studying from './screens/Studying';
import Game1 from "./screens/games/game1";
import Game2 from "./screens/games/game2";
// import Game3 from "./screens/games/game3";
// import Game4 from "./screens/games/game4";
// import Game5 from "./screens/games/game5";

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
        <Stack.Screen name="Game1" component={Game1} />
        <Stack.Screen name="Game2" component={Game2} />
        {/* <Stack.Screen name="Game3" component={Game3} />
        <Stack.Screen name="Game4" component={Game4} />
        <Stack.Screen name="Game5" component={Game5} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
