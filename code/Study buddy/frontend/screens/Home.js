import { View, Text } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';
import { HomeBuddy } from '../components/buddies/buddy';
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
        <HomeBuddy />
        <NavigationButton text="Start Studying!" link="SelectStudyTime" />
        <NavigationButton text="Game Menu" link="GameMenu" />
        <NavigationButton text="Statistics" link="Statistics" />
        <NavigationButton text="Settings" link="Settings" />
        <NavigationButton text="Logout" onPress={handleLogout} />
      </View>
    </Background>
  );
}
