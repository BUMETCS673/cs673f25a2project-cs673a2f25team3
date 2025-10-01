import { View } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';

// this page is not finished

// Statistics page - shows progress towards goal and previous study sessions
export default function Statistics() {
  return (
    <Background>
      <View style={styles.card}>
        <NavigationButton text="Return Home" link="Home" />
      </View>
    </Background>
  );
}