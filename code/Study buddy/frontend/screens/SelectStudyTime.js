import { View, Text } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';
import { createClock } from '../util/formatString';
import { getTimeLeftInGoal } from '../dataInterface/timeLeft';

/*
  30% framework
  70% manual
*/

// Page for selecting the time studying
export default function SelectStudyTime() {
  return (
    <Background>
      <View style={styles.card}>
        <Text style={styles.cardH1} accessibilityRole='header'>Select Study Time</Text>
        <Text style={styles.cardH2} accessibilityRole='header'>Time left in goal: {createClock(getTimeLeftInGoal())}</Text>
        <NavigationButton text="15 Minutes" link="Studying" params={{minutes: 15}} />
        <NavigationButton text="30 Minutes" link="Studying" params={{minutes: 30}} />
        <NavigationButton text="60 Minutes" link="Studying" params={{minutes: 60}} />
        <NavigationButton text="Any Amount" link="Studying" params={{countingUp: true}} />
        <NavigationButton text="Return Home" link="Home" />
        <NavigationButton text="Test (3 seconds)" link="Studying" params={{minutes: 0.05}} />
      </View>
    </Background>
  );
}