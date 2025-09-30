import { View } from 'react-native';
import { NavigationButton } from '../components/NavigationButton';

export default function SelectStudyTime({ navigation }) {
  return (
    <View>
      <NavigationButton text="15 Minutes" link="Studying" params={{minutes: "15"}} />
      <NavigationButton text="30 Minutes" link="Studying" params={{minutes: "30"}} />
      <NavigationButton text="60 Minutes" link="Studying" params={{minutes: "60"}} />
      <NavigationButton text="Return Home" link="Home" />
      <NavigationButton text="Test" link="Studying" params={{minutes: "0.2"}} />
    </View>
  );
}