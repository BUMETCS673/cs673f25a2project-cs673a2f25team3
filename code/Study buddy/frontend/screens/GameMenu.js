import { View, Text } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';

// this page is not finished

export default function GameMenu({ navigation }) {
  return (
    <Background>
      <View style={styles.card}>
        <Text h1 style={styles.cardH1}>Game Menu</Text>
        <NavigationButton text="Game 1" link="Game1" />
        <NavigationButton text="Game 2" link="Game2" />
        {/* <NavigationButton text="Game 3" link="Game3" />
        <NavigationButton text="Game 4" link="Game4" />
        <NavigationButton text="Game 5" link="Game5" /> */}
        <NavigationButton text="Return Home" link="Home" />
      </View>
    </Background>
  );
}