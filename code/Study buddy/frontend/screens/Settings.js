import { View } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';

// this page is not finished

// Settings page - used to change font, style, and other important settings
// Implimented settings: none
export default function Settings({ navigation }) {
  return (
    <Background>
      <View style={styles.card}>
        <NavigationButton text="Return Home" link="Home" />
      </View>
    </Background>
  );
}