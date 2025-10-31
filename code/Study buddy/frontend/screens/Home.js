/*
  30% AI
  70% Human
*/

import { View, Text } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext'; 
import { useNavigation } from '@react-navigation/native';

/*
  40% framework
  60% manual
*/

// Home page - this is the general page for navigation and the first page the user sees (after logging in)
export default function Home() {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = () => {
    logout(); // clear login state
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }], // back to login page and clear stack
    });
  };

  return (
    <Background>
      <View style={styles.card}>
        <Text style={styles.cardH1} accessibilityRole='header'>Home</Text>
        {/* Jump straight to the timer so the refreshed StudyTimerInterface is shown immediately */}
        <NavigationButton text="Start Studying!" link="Studying" />
        <NavigationButton text="Game Menu" link="GameMenu" />
        <NavigationButton text="Statistics" link="Statistics" />
        <NavigationButton text="Settings" link="Settings" />
        <NavigationButton text="Logout" onPress={handleLogout} />
      </View>
    </Background>
  );
}
