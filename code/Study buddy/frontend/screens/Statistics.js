import { View, Text } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';

/*
  50% framework
  50% manual
*/

// this page is not finished

// Statistics page - shows progress towards goal and previous study sessions
export default function Statistics() {
  return (
    <Background>
      <View style={styles.card}>
        <Text style={styles.cardH1} accessibilityRole='header'>Statistics</Text>
        <NavigationButton text="Return Home" link="Home" />
      </View>
    </Background>
  );
}