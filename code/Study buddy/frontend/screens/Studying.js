import { Text, Button, View } from 'react-native';

// this page is not finished

export default function Studying({ navigation, route }) {
  // get params
  const { minutes } = route.params;

  return (
    <View>
      {/* display the amount of time left */}
      <Text>Studying for {minutes} minutes</Text>

      {/* navigation */}
      <NavigationButton text="Select Different Time" link="SelectStudyTime" />
      <NavigationButton text="Return Home" link="Home" />
    </View>
  );
}