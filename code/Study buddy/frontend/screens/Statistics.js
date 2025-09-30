import { Button, View } from 'react-native';

// this page is not finished

export default function Statistics({ navigation }) {
  return (
    <View>
      <Button title="Return Home" onPress={() => navigation.navigate('Home')} as="a" />
    </View>
  );
}