import { View, Text } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';
import SettingsForm from '../components/SettingsForm';

/*
  50% framework
  50% manual
*/

// Settings page - used to change font, style, and other important settings
export default function Settings() {
  return (
    <Background>
      <View style={styles.card}>
        <Text style={styles.cardH1} accessibilityRole='header'>Settings</Text>
        <SettingsForm />
      </View>
    </Background>
  );
}