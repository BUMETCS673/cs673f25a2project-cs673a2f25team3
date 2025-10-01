import { Text, View } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';

// this page is not finished

// Studying page - this is the page that is open during studying
export default function Studying({ route }) {
  // get params
  const { minutes } = route.params;

  return (
    <Background>
      <View style={styles.card}>
        {/* display the amount of time left */}
        <Text>Studying for {minutes} minutes</Text>

        {/* navigation */}
        <NavigationButton text="Select Different Time" link="SelectStudyTime" />
        <NavigationButton text="Return Home" link="Home" />
      </View>
    </Background>
  );
}