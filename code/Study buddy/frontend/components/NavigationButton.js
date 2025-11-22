import { TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/style';
import { useNavigation } from '@react-navigation/native';

/*
  10% framework
  90% manual
*/

// purpose: button that redirects to a different page or executes custom onPress
// parameters: 
//    text: text on the button
//    link: routing name (optional)
//    onPress: custom function (optional)
//    params: parameters to send with link (optional)
// example: <NavigationButton text="15 Minutes" link="Studying" params={{minutes: "10"}} />
// example: <NavigationButton text="Logout" onPress={handleLogout} />
export const NavigationButton = ({ text, link, onPress, params, accent=false }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (link) {
      if (params) {
        navigation.navigate(link, params);
      } else {
        navigation.navigate(link);
      }
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} accessibilityRole="link" activeOpacity={0.85} style={accent ? styles.navigationAccentButton : styles.navigationButton}>
      <Text style={styles.navigationButtonText}>{text}</Text>
    </TouchableOpacity>
  );
};
