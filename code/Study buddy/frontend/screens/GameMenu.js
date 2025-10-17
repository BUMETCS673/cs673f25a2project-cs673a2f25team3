import { View, Text } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';

/*
  50% framework
  50% manual
*/

// this page is not finished

export default function GameMenu({ navigation }) {
  return (
    <Background>
      <View style={styles.card}>
        <Text style={styles.cardH1} accessibilityRole='header'>Game Menu</Text>
        <NavigationButton text="Return Home" link="Home" />
      </View>
    </Background>
  );
}