import { View, Text } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';

// Home page - this is the general page for navigation and the first page the user sees (after loging in)
export default function Home() {
  return (
    <Background>
      <View style={styles.card}>
        <Text h1 style={styles.cardH1}>Home</Text>
        <NavigationButton text="Start Studying!" link="SelectStudyTime" />
        <NavigationButton text="Game Menu" link="GameMenu" />
        <NavigationButton text="Statistics" link="Statistics" />
        <NavigationButton text="Settings" link="Settings" />
        <NavigationButton text="Logout" link="Login" />
      </View>
    </Background>
  );
}