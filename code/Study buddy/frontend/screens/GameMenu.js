import { View } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';

// this page is not finished

export default function GameMenu({ navigation }) {
  return (
    <Background>
      <View style={styles.card}>
        <NavigationButton text="Return Home" link="Home" />
      </View>
    </Background>
  );
}