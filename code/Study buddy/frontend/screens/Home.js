import { Button, View, TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';

export default function Home({ navigation }) {
  return (
    <View>
      <NavigationButton text="Start Studying!" link="SelectStudyTime" />
      <NavigationButton text="Game Menu" link="Game Menu" />
      <NavigationButton text="Statistics" link="Statistics" />
      <NavigationButton text="Settings" link="Settings" />
      <NavigationButton text="Logout" link="Login" />
    </View>
  );
}