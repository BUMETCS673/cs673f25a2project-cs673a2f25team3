import { View, Text } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';

/*
  50% framework
  50% manual
*/

// this page is not finished

// Login page - this page handles login and redirects to home once logged in. If another page is visited without logging in first, it will redirect here
export default function Login({ navigation }) {
  return (
    <Background>
      <View style={styles.card}>
        <Text style={styles.cardH1} accessibilityRole='header'>Login</Text>
        <NavigationButton text="Login" link="Home" />
      </View>
    </Background>
  );
}