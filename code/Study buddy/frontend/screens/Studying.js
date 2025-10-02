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
        <Text h1 style={styles.cardH1}>Study hard!</Text>
        <Text style={styles.paragraph}>{minutes} minutes left</Text>

        {/* navigation */}
        <NavigationButton text="Select Different Time" link="SelectStudyTime" />
        <NavigationButton text="Return Home" link="Home" />
      </View>
    </Background>
  );
}