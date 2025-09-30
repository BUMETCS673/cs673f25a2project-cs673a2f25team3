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
      <Button title="Select Different Time" onPress={() => navigation.navigate('SelectStudyTime')} as="a" />
      <Button title="Return Home" onPress={() => navigation.navigate('Home')} as="a" />
    </View>
  );
}