import { View, Text } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';

// Page for selecting the time studying
export default function SelectStudyTime({ navigation }) {
  return (
    <Background>
      <View style={styles.card}>
        <Text h1 style={styles.cardH1}>Select Study Time</Text>
        <NavigationButton text="15 Minutes" link="Studying" params={{minutes: "15"}} />
        <NavigationButton text="30 Minutes" link="Studying" params={{minutes: "30"}} />
        <NavigationButton text="60 Minutes" link="Studying" params={{minutes: "60"}} />
        <NavigationButton text="Return Home" link="Home" />
        <NavigationButton text="Test" link="Studying" params={{minutes: "0.2"}} />
      </View>
    </Background>
  );
}