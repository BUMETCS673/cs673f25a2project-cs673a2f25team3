import { View } from 'react-native';
import { NavigationButton } from '../components/NavigationButton';

// this page is not finished

// Settings page - used to change font, style, and other important settings
// Implimented settings: none
export default function Settings({ navigation }) {
  return (
    <View>
      <NavigationButton text="Return Home" link="Home" />
    </View>
  );
}